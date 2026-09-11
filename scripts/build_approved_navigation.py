#!/usr/bin/env python3
"""Render only the approved homepage and instructions entry, after the legacy build.

Editable presentation sources: editorial/navigation/*.html and the two navigation
assets. Legacy source pages remain intact for existing build-time transformations.
The article body fingerprints prevent publishing a stale adaptation after a source
edit. No other route, translation, media file or preference store is replaced.
"""
from __future__ import annotations
import argparse
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'editorial/navigation'
ASSETS = ('assets/navigation-approved.css', 'assets/navigation-approved.js')
HOME_CORRECTIONS = '''<style id="ig-home-corrections">
/* Condiciones vuelve al estilo neutro de las tarjetas secundarias. */
.small-card[data-section="condiciones"]{background:rgba(255,255,255,.8);border-color:#c4cede}
.small-card[data-section="condiciones"]>.icon,.small-card[data-section="condiciones"]>.external{color:var(--lilac)}
.small-card[data-section="condiciones"]:hover{border-color:var(--lilac);outline-color:var(--lilac)}
</style>'''


# The approved navigation presentation originally embedded a snapshot of the
# instructions entry. The entry has since received a documentary/semantic repair.
# Patch that presentation layer explicitly so a build cannot reintroduce the old
# hearing/stroke material or obsolete editorial-status text.
INSTRUCTIONS_TEMPLATE_PATCHES = {
    'es': [
        ('Si pasa con instrucciones largas o también con las cortas.', 'Si pasa solo con instrucciones largas, también con las cortas, o sobre todo cuando hay distracciones o ya estás haciendo otra tarea.'),
        ('Pide valoración si ocurre de forma frecuente y limita estudios o trabajo. Si también cuesta entender conversaciones con ruido, se pierden palabras o existe sospecha de pérdida auditiva, conviene valorar la audición; si el patrón es de larga evolución y aparece en varios ámbitos, también puede formar parte de una valoración de atención, lenguaje o funciones ejecutivas.', 'Pide valoración si ocurre con frecuencia y dificulta los estudios, el trabajo o tareas habituales. Conviene anotar cuándo pasa: si las instrucciones son largas, si hay distracciones o si tienes que recordar varios pasos a la vez. Esa información puede ayudar a valorar atención, lenguaje y memoria de trabajo.'),
        ('Una pérdida súbita del habla o de la comprensión, especialmente junto con debilidad facial o de un brazo, es una urgencia médica. La pérdida súbita de audición, sobre todo de un solo oído, también necesita atención inmediata.', 'Olvidar una instrucción habitual no es una urgencia médica. Si aparece de repente una confusión que no es habitual —por ejemplo, la persona no sabe dónde está, no puede pensar o hablar con claridad o no recuerda datos básicos—, busca atención médica inmediata.'),
        ('Memoria de trabajo: la instrucción entra y se pierde antes de usarla.', 'Olvidar una instrucción no permite saber por sí solo cuál es la causa.'),
        ('Dar tres cosas seguidas de pasillo.', 'Dar varias instrucciones seguidas mientras la persona está haciendo otra cosa.'),
        ('TDAH · Audición', 'Memoria de trabajo · TDAH'),
        ('<p>Referencia que figura en la ficha original:</p><div class="source-box">F13 · ASHA · Augmentative and Alternative Communication</div><p class="source-meta">La ficha fuente indica revisión editorial el 4 de septiembre de 2026 y citas pendientes de comprobación. Este cambio de presentación no añade una validación clínica ni una nueva fecha de revisión.</p>', '<p>Fuentes revisadas para esta ficha:</p><div class="source-box"><a href="https://www.nhs.uk/conditions/adhd-adults/" rel="noopener" target="_blank">NHS · ADHD in adults</a><br/><a href="https://www.repository.cam.ac.uk/items/117106f9-1cc0-4aa2-b351-db33f5079c68" rel="noopener" target="_blank">University of Cambridge · Following instructions from working memory</a><br/><a href="https://pubmed.ncbi.nlm.nih.gov/23688211/" rel="noopener" target="_blank">PubMed · ADHD and working memory in adults</a><br/><a href="https://www.nhs.uk/symptoms/confusion/" rel="noopener" target="_blank">NHS · Sudden confusion</a></div><p class="source-meta">Revisión documental: 11 de septiembre de 2026. La dificultad para retener instrucciones se separa de los problemas de audición y de las urgencias que no corresponden a esta situación.</p>'),
        ('<summary>Ver todo el texto original</summary><div class="detail-copy"><p class="source-meta">Se conserva a continuación la redacción anterior de la ficha, incluidos sus rótulos y notas.</p>', '<summary>Ver la ficha completa</summary><div class="detail-copy"><p class="source-meta">Se muestra a continuación el contenido completo de la ficha.</p>'),
        ('<section class="original-section"><h3>Base documental y revisión</h3><p>F13 · ASHA · Augmentative and Alternative Communication</p></section><section class="original-section"><h3>Revisión editorial</h3><p>Revisión editorial: 4 de septiembre de 2026. Las fuentes se citan por su nombre; las páginas siguen en noindex hasta que cada cita esté comprobada.</p></section>', '<section class="original-section"><h3>Base documental y fuentes</h3><p>NHS · ADHD in adults · University of Cambridge · Following instructions from working memory · PubMed · ADHD and working memory in adults · NHS · Sudden confusion</p></section><section class="original-section"><h3>Revisión documental</h3><p>Revisión documental: 11 de septiembre de 2026. La dificultad para retener instrucciones se separa de los problemas de audición y de las urgencias que no corresponden a esta situación.</p></section>'),
    ],
    'en': [
        ('Whether it happens with long instructions or with short ones too.', 'Whether it happens only with long instructions, with short ones too, or mainly when there are distractions or another task is already under way.'),
        ('Whether it happens only with long instructions or with short ones too.', 'Whether it happens only with long instructions, with short ones too, or mainly when there are distractions or another task is already under way.'),
        ('Seek an assessment if this happens frequently and limits education or work. If conversations are also hard to follow in noise, words are missed or hearing loss is suspected, hearing should be assessed; if the pattern is long-standing and appears in several settings, attention, language or executive-function assessment may also be relevant.', 'Seek an assessment if this happens frequently and makes study, work or everyday tasks difficult. It can help to note when it happens: whether instructions are long, there are distractions, or several steps have to be held in mind at once. That information can help when attention, language and working memory are assessed.'),
        ('A sudden loss of speech or understanding, especially with facial or arm weakness, is a medical emergency. Sudden hearing loss, particularly in one ear, also needs immediate medical attention.', 'Forgetting a routine instruction is not a medical emergency. If someone suddenly becomes unusually confused — for example, they do not know where they are, cannot think or speak clearly, or cannot remember basic information — seek immediate medical help.'),
        ('Working memory may be involved when an instruction is heard but is lost before it can be used.', 'Forgetting an instruction does not, by itself, show what is causing the difficulty.'),
        ('Giving three instructions in a row while passing in a corridor.', 'Giving several instructions in a row while the person is already doing something else.'),
        ('TDAH · Audición', 'Working memory · ADHD'),
        ('<p>Reference listed in the original entry:</p><div class="source-box">F13 · ASHA · Augmentative and Alternative Communication</div><p class="source-meta">The source entry states an editorial review on 4 September 2026 and citations awaiting checking. This presentation change does not add clinical validation or a new review date.</p>', '<p>Sources reviewed for this entry:</p><div class="source-box"><a href="https://www.nhs.uk/conditions/adhd-adults/" rel="noopener" target="_blank">NHS · ADHD in adults</a><br/><a href="https://www.repository.cam.ac.uk/items/117106f9-1cc0-4aa2-b351-db33f5079c68" rel="noopener" target="_blank">University of Cambridge · Following instructions from working memory</a><br/><a href="https://pubmed.ncbi.nlm.nih.gov/23688211/" rel="noopener" target="_blank">PubMed · ADHD and working memory in adults</a><br/><a href="https://www.nhs.uk/symptoms/confusion/" rel="noopener" target="_blank">NHS · Sudden confusion</a></div><p class="source-meta">Documentary review: 11 September 2026. Difficulty retaining instructions is kept separate from hearing problems and unrelated emergency warnings.</p>'),
        ('<summary>View all the original text</summary><div class="detail-copy"><p class="source-meta">The previous wording of the entry is preserved below, including its headings and notes.</p>', '<summary>View the full entry</summary><div class="detail-copy"><p class="source-meta">The full content of the entry is shown below.</p>'),
        ('<section class="original-section"><h3>Sources and review</h3><p>F13 · ASHA · Augmentative and Alternative Communication</p></section><section class="original-section"><h3>Editorial review</h3><p>Editorial review: 4 September 2026. Sources are cited by name; these pages stay noindex until every citation has been checked.</p></section>', '<section class="original-section"><h3>Sources</h3><p>NHS · ADHD in adults · University of Cambridge · Following instructions from working memory · PubMed · ADHD and working memory in adults · NHS · Sudden confusion</p></section><section class="original-section"><h3>Documentary review</h3><p>Documentary review: 11 September 2026. Difficulty retaining instructions is kept separate from hearing problems and unrelated emergency warnings.</p></section>'),
    ],
}

JS_PATCHES = [
    ('["May be related to", "TDAH · Audición"]', '["May be related to", "Working memory · ADHD"]'),
    ('TDAH · Audición', 'Memoria de trabajo · TDAH'),
    ('Memoria de trabajo: la instrucción entra y se pierde antes de usarla.', 'Olvidar una instrucción no permite saber por sí solo cuál es la causa.'),
    ('Working memory may be involved when an instruction is heard but is lost before it can be used.', 'Forgetting an instruction does not, by itself, show what is causing the difficulty.'),
    ('Si pasa con instrucciones largas o también con las cortas.', 'Si pasa solo con instrucciones largas, también con las cortas, o sobre todo cuando hay distracciones o ya estás haciendo otra tarea.'),
    ('Whether it happens with long instructions or with short ones too.', 'Whether it happens only with long instructions, with short ones too, or mainly when there are distractions or another task is already under way.'),
    ('Whether it happens only with long instructions or with short ones too.', 'Whether it happens only with long instructions, with short ones too, or mainly when there are distractions or another task is already under way.'),
    ('Dar tres cosas seguidas de pasillo.', 'Dar varias instrucciones seguidas mientras la persona está haciendo otra cosa.'),
    ('Giving three instructions in a row while passing in a corridor.', 'Giving several instructions in a row while the person is already doing something else.'),
    ('Pide valoración si ocurre de forma frecuente y limita estudios o trabajo. Si también cuesta entender conversaciones con ruido, se pierden palabras o existe sospecha de pérdida auditiva, conviene valorar la audición; si el patrón es de larga evolución y aparece en varios ámbitos, también puede formar parte de una valoración de atención, lenguaje o funciones ejecutivas.', 'Pide valoración si ocurre con frecuencia y dificulta los estudios, el trabajo o tareas habituales. Conviene anotar cuándo pasa: si las instrucciones son largas, si hay distracciones o si tienes que recordar varios pasos a la vez. Esa información puede ayudar a valorar atención, lenguaje y memoria de trabajo.'),
    ('Seek an assessment if this happens frequently and limits education or work. If conversations are also hard to follow in noise, words are missed or hearing loss is suspected, hearing should be assessed; if the pattern is long-standing and appears in several settings, attention, language or executive-function assessment may also be relevant.', 'Seek an assessment if this happens frequently and makes study, work or everyday tasks difficult. It can help to note when it happens: whether instructions are long, there are distractions, or several steps have to be held in mind at once. That information can help when attention, language and working memory are assessed.'),
    ('Una pérdida súbita del habla o de la comprensión, especialmente junto con debilidad facial o de un brazo, es una urgencia médica. La pérdida súbita de audición, sobre todo de un solo oído, también necesita atención inmediata.', 'Olvidar una instrucción habitual no es una urgencia médica. Si aparece de repente una confusión que no es habitual —por ejemplo, la persona no sabe dónde está, no puede pensar o hablar con claridad o no recuerda datos básicos—, busca atención médica inmediata.'),
    ('A sudden loss of speech or understanding, especially with facial or arm weakness, is a medical emergency. Sudden hearing loss, particularly in one ear, also needs immediate medical attention.', 'Forgetting a routine instruction is not a medical emergency. If someone suddenly becomes unusually confused — for example, they do not know where they are, cannot think or speak clearly, or cannot remember basic information — seek immediate medical help.'),
    ('Base documental y validación', 'Base documental y fuentes'),
    ('Sources and validation', 'Sources'),
    ('F13 · ASHA · Augmentative and Alternative Communication', 'NHS · ADHD in adults · University of Cambridge · Following instructions from working memory · PubMed · ADHD and working memory in adults · NHS · Sudden confusion'),
    ('Validación editorial: 10 de septiembre de 2026. Las fuentes citadas y los límites de la ficha permanecen identificados para facilitar su comprobación y actualización.', 'Revisión documental: 11 de septiembre de 2026. La dificultad para retener instrucciones se separa de los problemas de audición y de las urgencias que no corresponden a esta situación.'),
    ('Editorial validation: 10 September 2026. The cited sources and the limits of the entry remain identified to support checking and future updates.', 'Documentary review: 11 September 2026. Difficulty retaining instructions is kept separate from hearing problems and unrelated emergency warnings.'),
    ('Validación editorial', 'Revisión documental'),
    ('Editorial validation', 'Documentary review'),
    ('Referencia que figura en la ficha original:', 'Fuentes revisadas para esta ficha:'),
    ('Reference listed in the original entry:', 'Sources reviewed for this entry:'),
    ('La ficha está validada editorialmente para esta edición. Este cambio de presentación no añade una validación clínica.', 'Revisión documental: 11 de septiembre de 2026. La dificultad para retener instrucciones se separa de los problemas de audición y de las urgencias que no corresponden a esta situación.'),
    ('The entry is editorially validated for this edition. This presentation change does not add clinical validation.', 'Documentary review: 11 September 2026. Difficulty retaining instructions is kept separate from hearing problems and unrelated emergency warnings.'),
    ('Ver todo el texto original', 'Ver la ficha completa'),
    ('View all the original text', 'View the full entry'),
    ('Se conserva a continuación la redacción anterior de la ficha, incluidos sus rótulos y notas.', 'Se muestra a continuación el contenido completo de la ficha.'),
    ('The previous wording of the entry is preserved below, including its headings and notes.', 'The full content of the entry is shown below.'),
]

FORBIDDEN_NAVIGATION_STALE = (
    'F13 · ASHA', 'Revisión editorial', 'Editorial review',
    'Validación editorial', 'Editorial validation',
    'citas pendientes de comprobación', 'citations awaiting checking',
)


def apply_exact_patches(text: str, pairs, label: str) -> str:
    for old, new in pairs:
        if old in text:
            text = text.replace(old, new)
        elif new not in text:
            raise ValueError(f'Missing reviewed navigation text in {label}: {old[:90]!r}')
    return text


def assert_navigation_clean(text: str, label: str) -> None:
    found = [x for x in FORBIDDEN_NAVIGATION_STALE if x in text]
    if found:
        raise ValueError(f'Stale reviewed content in {label}: {found}')


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def article_fingerprint(text: str) -> str:
    match = re.search(r'<article\b[^>]*>(.*?)</article>', text, flags=re.S)
    if not match:
        raise ValueError('Original article is missing')
    plain = html.unescape(re.sub(r'<[^>]*>', ' ', match[1]))
    return digest(' '.join(plain.split()).encode('utf-8'))


def build(check: bool = False) -> dict:
    manifest = json.loads((SOURCE / 'manifest.json').read_text(encoding='utf-8'))
    for path, expected in manifest['source_articles'].items():
        if article_fingerprint((ROOT/path).read_text(encoding='utf-8')) != expected:
            raise ValueError('Article text changed: ' + path +
                             '. Review the approved adaptation in editorial/navigation before publishing.')
    output = ROOT/'dist'
    if not output.is_dir() or output.is_symlink():
        raise ValueError('Build the regular public dist directory first')
    # The JS asset also embedded the pre-review snapshot. Patch the public copy only;
    # the reviewed source entry remains the authority and is fingerprinted above.
    js_public = output/'assets/navigation-approved.js'
    if not js_public.is_file():
        raise ValueError('Missing public navigation asset')
    js_text = js_public.read_text(encoding='utf-8')
    js_text = apply_exact_patches(js_text, JS_PATCHES, 'assets/navigation-approved.js')
    assert_navigation_clean(js_text, 'assets/navigation-approved.js')
    js_public.write_text(js_text, encoding='utf-8')
    versions = {p: digest((output/p).read_bytes())[:16] if (output/p).is_file() else digest((ROOT/p).read_bytes())[:16] for p in ASSETS}
    rendered = []
    for target, template in manifest['pages'].items():
        path = output/target
        if not path.is_file():
            raise ValueError('Refusing to create an unexpected route: ' + target)
        text = (SOURCE/template).read_text(encoding='utf-8')
        if target.endswith('necesito-que-me-repitan-las-instrucciones/index.html'):
            text = apply_exact_patches(text, INSTRUCTIONS_TEMPLATE_PATCHES['es'], target)
            assert_navigation_clean(text, target)
        elif target.endswith('i-need-instructions-repeated/index.html'):
            text = apply_exact_patches(text, INSTRUCTIONS_TEMPLATE_PATCHES['en'], target)
            assert_navigation_clean(text, target)
        if 'noindex,nofollow,noarchive' in text or 'iris-review-route' in text:
            raise ValueError('A review wrapper must not be published')
        if target == 'index.html':
            # "Secciones" es un ancla normal. No debe depender del router JS.
            text = text.replace(' data-route="secciones"', '')
            # Condiciones no tiene color propio en la portada.
            text = text.replace('</head>', HOME_CORRECTIONS + '</head>', 1)
        for asset, version in versions.items():
            text = text.replace('"/'+asset+'"', '"/'+asset+'?v='+version+'"')
        version = digest(text.encode('utf-8'))[:16]
        text = text.replace('</head>', '<meta name="ig-navigation-build" content="'+version+'"/></head>', 1)
        raw = (text.rstrip()+'\n').encode('utf-8')
        if check:
            if path.read_bytes() != raw:
                raise ValueError('Approved output is out of date: ' + target)
        else:
            path.write_bytes(raw)
        rendered.append({'path': target, 'template': template, 'sha256': digest(raw), 'bytes': len(raw)})
    report = {'pages':rendered, 'assets':versions, 'original_article_text_preserved':True,
              'scope':'Homepage and one entry in Spanish and English; all other routes unchanged',
              'clinical_review_added':False}
    if not check:
        (ROOT/'reports').mkdir(exist_ok=True)
        (ROOT/'reports/approved-navigation-build.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
    return report


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--check',action='store_true')
    build(parser.parse_args().check)
