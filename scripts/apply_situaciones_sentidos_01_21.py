#!/usr/bin/env python3
"""Integra la tanda 01-21 de Situaciones · Sentidos sin cambiar títulos ni 22-24."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

UPDATES = {
    1: (
        "Una etiqueta, una costura o una tela me rozan la piel. La molestia continúa mientras llevo puesta la prenda y me distrae de lo que estoy haciendo. Al cambiarme de ropa o quitar lo que me roza, la molestia disminuye.",
        "A tag, seam or fabric rubs against my skin. The discomfort continues while I am wearing the garment and distracts me from what I am doing. When I change clothes or remove what is rubbing, the discomfort decreases.",
    ),
    2: (
        "En el supermercado hay luces intensas, música, voces, carros y muchas personas alrededor. Tantos sonidos, luces y movimientos me cansan mucho. Al salir busco un lugar tranquilo y descanso.",
        "In the supermarket there are bright lights, music, voices, trolleys and many people around me. So many sounds, lights and movements make me very tired. When I leave, I look for a quiet place and rest.",
    ),
    3: (
        "Paso varias horas sin sentir hambre ni sed. Me doy cuenta cuando ya tengo dolor de cabeza, mareo, cansancio o mal humor. Entonces como o bebo.",
        "I go for several hours without feeling hungry or thirsty. I notice when I already have a headache, dizziness, tiredness or irritability. Then I eat or drink.",
    ),
    4: (
        "No me encuentro bien, pero no sé qué lo está causando. No sé si tengo hambre, si tengo cansancio o si el ruido, las luces o la cantidad de gente me están molestando. Tardo en saber qué hacer porque las sensaciones se parecen.",
        "I do not feel well, but I do not know what is causing it. I do not know whether I am hungry, tired, or bothered by the noise, lights or number of people around me. It takes me time to know what to do because the sensations feel similar.",
    ),
    5: (
        "Paso varias horas sin sentir hambre. Cuando por fin la noto, ya tengo mareo, temblor, dolor de cabeza o mucho mal humor. Entonces tengo que comer cuanto antes.",
        "I go for several hours without feeling hungry. When I finally notice it, I already feel dizzy or shaky, have a headache or feel very irritable. Then I have to eat as soon as possible.",
    ),
    6: (
        "Cuando hay muchos sonidos al mismo tiempo, llega un momento en que ya no los soporto. Me tapo los oídos o salgo del lugar. Busco un sitio con menos ruido.",
        "When there are many sounds at the same time, I reach a point where I cannot tolerate them any longer. I cover my ears or leave the place. I look for somewhere quieter.",
    ),
    7: (
        "Durante el examen oigo cómo alguien mueve una silla, tose, hace clic con un bolígrafo o pasa una hoja. Esos sonidos me distraen de las preguntas. Aunque haya estudiado, pierdo tiempo volviendo a concentrarme.",
        "During an exam I hear someone move a chair, cough, click a pen or turn a page. Those sounds distract me from the questions. Even when I have studied, I lose time trying to focus again.",
    ),
    8: (
        "Un aplauso, una moto que pasa cerca o un plato al golpear el fregadero me hacen daño en los oídos. Cuando el sonido termina, el dolor tarda un rato en desaparecer.",
        "Applause, a motorbike passing nearby or a plate hitting the sink can hurt my ears. When the sound stops, the pain takes a while to go away.",
    ),
    9: (
        "Oír a alguien masticar, respirar o hacer clic repetidamente con un bolígrafo me provoca rabia, angustia o mucha tensión. Salgo del lugar para dejar de oír ese sonido.",
        "Hearing someone chew, breathe or repeatedly click a pen causes anger, distress or strong tension in me. I leave the place so I no longer have to hear that sound.",
    ),
    10: (
        "La luz blanca o muy intensa me molesta en los ojos. Después de un rato tengo dolor de cabeza o cierro los ojos. También busco un lugar con menos luz.",
        "White or very bright light bothers my eyes. After a while I get a headache or close my eyes. I also look for a place with less light.",
    ),
    11: (
        "Los perfumes, los productos de limpieza y otros olores fuertes me provocan náuseas, dolor de cabeza o mucho malestar. Salgo de la tienda para dejar de olerlos.",
        "Perfume, cleaning products and other strong smells cause nausea, headaches or a lot of discomfort for me. I leave the shop so I no longer have to smell them.",
    ),
    12: (
        "Tardo en darme cuenta de que tengo frío. Lo noto cuando ya estoy temblando o tengo las manos y los pies muy fríos.",
        "It takes me time to realise that I am cold. I notice it when I am already shivering or my hands and feet are very cold.",
    ),
    13: (
        "Enseguida tengo demasiado calor. Me mareo o dejo lo que estoy haciendo. Voy a un lugar más fresco y descanso.",
        "I get too hot very quickly. I feel dizzy or stop what I am doing. I go somewhere cooler and rest.",
    ),
    14: (
        "Muevo las piernas, cambio de postura, me balanceo o camino mientras escucho o trabajo. Al moverme sigo mejor lo que estoy escuchando. También termino con más facilidad lo que estoy haciendo.",
        "I move my legs, change position, rock or walk while I listen or work. Moving helps me follow what I am hearing. It also helps me finish what I am doing.",
    ),
    15: (
        "Las escaleras mecánicas, los ascensores, los vehículos y algunos movimientos rápidos me marean. Pierdo estabilidad y me sujeto. Otras veces espero unos segundos sin moverme.",
        "Escalators, lifts, vehicles and some quick movements make me dizzy. I lose my balance and hold on to something. At other times I wait a few seconds without moving.",
    ),
    16: (
        "Cuando hay muchas personas a mi alrededor, miro continuamente por dónde camino para no chocar con nadie. Pierdo de vista la salida o dejo de recordar hacia dónde iba. Busco un lugar con menos gente para orientarme otra vez.",
        "When there are many people around me, I keep watching where I walk so that I do not bump into anyone. I lose sight of the exit or forget where I was going. I look for a less crowded place so I can find my way again.",
    ),
    17: (
        "Si alguien me toca sin avisar, doy un sobresalto y me aparto. Tardo unos segundos en entender quién me ha tocado y qué ha pasado.",
        "If someone touches me without warning, I startle and move away. It takes me a few seconds to understand who touched me and what happened.",
    ),
    18: (
        "No noto si estoy haciendo demasiada fuerza o demasiado poca. Me ocurre al escribir, abrir un objeto, agarrar algo o abrazar a alguien.",
        "I do not notice whether I am using too much or too little force. This happens when I write, open something, hold an object or hug someone.",
    ),
    19: (
        "Cuando siento nervios o mucha tensión, toco una textura, aprieto un objeto o hago fuerza con las manos. Después noto menos tensión y continúo con lo que estaba haciendo.",
        "When I feel nervous or very tense, I touch a texture, squeeze an object or press with my hands. Afterwards I feel less tense and continue what I was doing.",
    ),
    20: (
        "Hay sabores que noto tan fuertes que dejo de comer. Me ocurre con determinados alimentos dulces, salados, amargos, ácidos o picantes.",
        "Some flavours feel so strong that I stop eating. This happens with certain sweet, salty, bitter, sour or spicy foods.",
    ),
    21: (
        "El agua al caer sobre mi piel me molesta o me duele. También me molestan la temperatura, el ruido de la ducha o la sensación de tener el cuerpo mojado.",
        "Water falling on my skin feels uncomfortable or painful. The temperature, the sound of the shower or the feeling of having a wet body also bother me.",
    ),
}

TAIL = {
    22: (
        "Pasar de un lugar frío a uno caliente, o de uno caliente a uno frío, me deja sin energía. Después necesito sentarme o tumbarme y descansar antes de seguir con lo que estaba haciendo.",
        "Moving from a cold place to a warm one, or from a warm place to a cold one, leaves me without energy. Afterwards, I need to sit or lie down and rest before continuing with what I was doing.",
    ),
    23: (
        "Al poco tiempo de sentarme, la postura empieza a molestarme. Cambio la posición de las piernas, me siento de otra manera o me levanto hasta encontrar una postura en la que tenga menos molestias.",
        "Soon after I sit down, the position starts to bother me. I move my legs, sit differently or stand up until I find a position that causes less discomfort.",
    ),
    24: (
        "Una prenda que ayer llevaba sin problema hoy me molesta. En los días en que he dormido mal, tengo calor o llevo muchas horas fuera de casa, noto más la tela, las costuras y la presión de la ropa.",
        "A piece of clothing that did not bother me yesterday bothers me today. On days when I have slept badly, feel hot or have been away from home for many hours, I notice the fabric, seams and pressure of the clothing more.",
    ),
}

HIDE_SCRIPT = r'''#!/usr/bin/env python3
"""Oculta los estados editoriales de Condiciones y Situaciones en la presentación."""
from __future__ import annotations
import argparse, json, re
from pathlib import Path


def transform(text: str) -> tuple[str, int]:
    before = text
    text = re.sub(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*\blil\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>', '', text, flags=re.I)
    text = re.sub(r'<p\b[^>]*class="[^"]*\bnotice\b[^"]*"[^>]*>\s*Validated for publication in this edition\. Sources, scope and limitations remain visible on this page\.\s*</p>', '', text, flags=re.I)
    pairs = [
        ('Última validación del texto', 'Última revisión del texto'),
        ('Base documental y validación', 'Base documental y revisión'),
        ('Sources and validation', 'Sources and review'),
        ('<h2>Validation</h2>', '<h2>Review</h2>'),
        ('<h3>Validación editorial</h3>', '<h3>Revisión editorial</h3>'),
        ('<h3>Editorial validation</h3>', '<h3>Editorial review</h3>'),
        ('Validación editorial:', 'Revisión editorial:'),
        ('Editorial validation:', 'Editorial review:'),
    ]
    for old, new in pairs:
        text = text.replace(old, new)
    text = text.replace(
        'La ficha está validada editorialmente para esta edición. Este cambio de presentación no añade una validación clínica.',
        'La ficha mantiene su revisión editorial para esta edición. Este cambio de presentación no añade una valoración clínica.'
    )
    text = text.replace(
        'The entry is editorially validated for this edition. This presentation change does not add clinical validation.',
        'The entry keeps its editorial review for this edition. This presentation change does not add a clinical assessment.'
    )
    text = text.replace(
        'The 185 entries are published and validated for this edition. Sources and scope remain visible in each entry; evidence classification is shown where applicable.',
        'The 185 entries are published. Sources and scope remain visible in each entry; evidence classification is shown where applicable.'
    )
    return text, int(text != before)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    targets = [
        root/'es/situaciones/index.html', root/'en/situations/index.html',
        root/'es/neurodiversidad/condiciones/index.html', root/'en/neurodiversity/conditions/index.html',
    ]
    for pattern in (
        'es/situaciones/*/index.html', 'en/situations/*/index.html',
        'es/neurodiversidad/condiciones/*/index.html', 'en/neurodiversity/conditions/*/index.html',
    ):
        targets.extend(sorted(root.glob(pattern)))
    seen, changed = set(), 0
    for p in targets:
        if not p.is_file() or p in seen:
            continue
        seen.add(p)
        before = p.read_text(encoding='utf-8')
        after, n = transform(before)
        if n:
            p.write_text(after, encoding='utf-8')
            changed += 1
    forbidden = [
        re.compile(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>', re.I),
        re.compile(r'<h[1-6][^>]*>\s*(?:Última validación del texto|Base documental y validación|Sources and validation|Validation|Validación editorial|Editorial validation)\s*</h[1-6]>', re.I),
        re.compile(r'(?:Validación editorial:|Editorial validation:)', re.I),
        re.compile(r'Validated for publication in this edition', re.I),
    ]
    bad=[]
    for p in seen:
        text=p.read_text(encoding='utf-8')
        if any(rx.search(text) for rx in forbidden):
            bad.append(p.relative_to(root).as_posix())
    if bad:
        raise AssertionError('Rótulos de validación visibles restantes: '+repr(bad[:20]))
    print(json.dumps({'pages_checked':len(seen),'pages_changed':changed,'internal_status_preserved':True,'visible_validation_labels':0},ensure_ascii=False))


if __name__=='__main__':
    main()
'''


def replace_descriptions_in_source() -> str:
    source_path = ROOT/'editorial/reviews/situaciones_sentidos_ES_EN.md'
    source = source_path.read_text(encoding='utf-8')
    for number, (es, en) in UPDATES.items():
        rx = re.compile(rf'(^## {number}\. [^\n]+\n\n### ES\n)([^\n]+)(\n\n### EN\n)([^\n]+)', re.M)
        source, count = rx.subn(lambda m: m.group(1)+es+m.group(3)+en, source, count=1)
        if count != 1:
            raise AssertionError(f'Entrada {number}: no localizada de forma única')
    source_path.write_text(source, encoding='utf-8')
    return hashlib.sha256(source.encode('utf-8')).hexdigest()


def update_hash(digest: str) -> None:
    author_path=ROOT/'scripts/sentidos_author.py'
    text=author_path.read_text(encoding='utf-8')
    text,n=re.subn(r"SOURCE_SHA256 = '[0-9a-f]{64}'",f"SOURCE_SHA256 = '{digest}'",text,count=1)
    if n!=1: raise AssertionError('SOURCE_SHA256 no localizado')
    author_path.write_text(text,encoding='utf-8')
    manifest=ROOT/'editorial/reviews/situaciones-sentidos-manifest.json'
    text=manifest.read_text(encoding='utf-8')
    text,n=re.subn(r'("source_sha256"\s*:\s*")[0-9a-f]{64}("\s*,)',lambda m:m.group(1)+digest+m.group(2),text,count=1)
    if n!=1: raise AssertionError('source_sha256 del manifiesto no localizado')
    manifest.write_text(text,encoding='utf-8')


def apply_pages() -> None:
    sys.path.insert(0,str((ROOT/'scripts').resolve()))
    import sentidos_author as sa
    rows=sa.approved_rows()
    if len(rows)!=24: raise AssertionError('Deben seguir existiendo 24 entradas de Sentidos')
    for row in rows[21:]:
        if (row['es'],row['en'])!=TAIL[row['number']]:
            raise AssertionError(f'La entrada {row["number"]} cambió y esta tanda no la incluye')
    targets=rows[:21]
    for row in targets:
        for lang in ('es','en'):
            p=ROOT/row[lang+'_path']
            p.write_text(sa.page_update(p.read_text(encoding='utf-8'),row,lang),encoding='utf-8')
    for lang,rel in sa.INDEXES.items():
        p=ROOT/rel
        p.write_text(sa.index_update(p.read_text(encoding='utf-8'),rel,targets,lang),encoding='utf-8')
    p=ROOT/'buscador.json'
    data=json.loads(p.read_text(encoding='utf-8'))
    by={x.get('u'):x for x in data}
    for row in targets:
        route=sa.route(row['es_path'])
        rec=by.get(route)
        if not rec or not isinstance(rec.get('en'),dict):
            raise AssertionError('Registro de buscador ausente: '+route)
        rec['d']=row['es'];rec['en']['d']=row['en']
    p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    sa.check(ROOT)


def wire_generic_integrator() -> None:
    p=ROOT/'scripts/run_accessibility_descriptions_part1.py'
    text=p.read_text(encoding='utf-8')
    if 'import sentidos_author as sentidos' not in text:
        needle='import apply_accessibility_descriptions_part1 as core\n'
        if needle not in text: raise AssertionError('Import del integrador general no localizado')
        text=text.replace(needle,needle+'import sentidos_author as sentidos\n',1)
    anchor='core.map_routes=map_routes\ncore.check=check\n'
    replacement='''_generic_rows = core.rows


def combined_rows():
    """El paquete general conserva el resto; Sentidos usa su fuente editorial protegida."""
    approved = _generic_rows()
    sensory = {row['number']: row for row in sentidos.approved_rows()}
    for row in approved:
        if row.get('area') != 'Sentidos':
            continue
        src = sensory[row['number']]
        row['title_es'] = src['title_es']
        row['es'] = src['es']
        row['en'] = src['en']
    return approved


core.rows=combined_rows
core.map_routes=map_routes
core.check=check
'''
    if anchor in text:
        text=text.replace(anchor,replacement,1)
    elif 'core.rows=combined_rows' not in text:
        raise AssertionError('Punto de integración de Sentidos no localizado')
    p.write_text(text,encoding='utf-8')


def wire_hidden_status() -> None:
    hide=ROOT/'scripts/hide_internal_validation_labels.py'
    hide.write_text(HIDE_SCRIPT,encoding='utf-8')
    p=ROOT/'scripts/build_site.py'
    text=p.read_text(encoding='utf-8')
    if 'hide_internal_validation_labels.py' not in text:
        anchor="    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_validation_labels.py'),'--root',str(dst)],cwd=ROOT,check=True)\n"
        if anchor not in text: raise AssertionError('Finalizador de estados no localizado')
        text=text.replace(anchor,anchor+"    # Los estados editoriales de Condiciones/Situaciones son internos.\n    subprocess.run([sys.executable,str(ROOT/'scripts/hide_internal_validation_labels.py'),'--root',str(dst)],cwd=ROOT,check=True)\n",1)
        p.write_text(text,encoding='utf-8')


def apply() -> None:
    if list(UPDATES)!=list(range(1,22)): raise AssertionError('La tanda debe contener 1-21')
    digest=replace_descriptions_in_source()
    update_hash(digest)
    apply_pages()
    wire_generic_integrator()
    wire_hidden_status()
    print(json.dumps({'updated':21,'source_sha256':digest,'entries_22_24_unchanged':True,'deployment':False},ensure_ascii=False))


def verify_dist() -> None:
    sys.path.insert(0,str((ROOT/'scripts').resolve()))
    import sentidos_author as sa
    result=sa.check(ROOT/'dist')
    if result['entries']!=24 or result['exact_descriptions']!=48: raise AssertionError(result)
    rows=sa.approved_rows()
    for row in rows[21:]:
        if (row['es'],row['en'])!=TAIL[row['number']]: raise AssertionError(f'Entrada {row["number"]} alterada')
    patterns=[
        re.compile(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>',re.I),
        re.compile(r'<h[1-6][^>]*>\s*(?:Última validación del texto|Base documental y validación|Sources and validation|Validation|Validación editorial|Editorial validation)\s*</h[1-6]>',re.I),
        re.compile(r'(?:Validación editorial:|Editorial validation:)',re.I),
        re.compile(r'Validated for publication in this edition',re.I),
    ]
    bad=[]
    for glob in ('es/situaciones/*/index.html','en/situations/*/index.html','es/neurodiversidad/condiciones/*/index.html','en/neurodiversity/conditions/*/index.html'):
        for p in (ROOT/'dist').glob(glob):
            text=p.read_text(encoding='utf-8')
            if any(rx.search(text) for rx in patterns): bad.append(p.relative_to(ROOT/'dist').as_posix())
    if bad: raise AssertionError('Estado VALIDADA visible: '+repr(bad[:20]))
    print(json.dumps({'sentidos_pages_checked':48,'first_batch':21,'tail_unchanged':3,'visible_validation_labels_conditions_situations':0},ensure_ascii=False))


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--verify-dist',action='store_true');args=ap.parse_args()
    verify_dist() if args.verify_dist else apply()


if __name__=='__main__':
    main()
