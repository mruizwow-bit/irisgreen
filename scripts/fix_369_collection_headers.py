#!/usr/bin/env python3
"""#369 P22/P24/P27 · final public collection header normalization.

Runs on dist after all R50/R67/R69 adapters so older recovery passes cannot
reintroduce verbose or internal header copy.
"""
from __future__ import annotations
import argparse
from pathlib import Path

REPLACEMENTS={
 'es/neurodiversidad/condiciones/index.html':[
  ('Fichas de condiciones, experiencias e identidades. Cada una dice qué ayuda, qué no está demostrado y en qué documento se apoya.',
   'Fichas sobre condiciones, experiencias e identidades.'),
 ],
 'en/neurodiversity/conditions/index.html':[
  ('Entries on conditions, experiences and identities. Each one says what helps, what is not supported by evidence and which document it relies on.',
   'Entries on conditions, experiences and identities.'),
  ('<p class="notice">All 185 entries are mounted, in all three languages. They all remain drafts: the source is named and not yet checked, and 25 have no grade assigned.</p>',''),
 ],
 'es/situaciones/index.html':[
  ('Fichas de situaciones del día a día. Cada una dice qué observar, qué puede ayudar y cuándo pedir una valoración.',
   'Situaciones cotidianas y formas de afrontarlas con información clara.'),
  ('<p class="notice">Esta página describe una situación del día a día, no un diagnóstico. La misma situación puede tener varias explicaciones, y quien las distingue es una valoración profesional.</p>',''),
 ],
 'en/situations/index.html':[
  ('Everyday situation entries. Each one says what to look at, what may help and when to ask for an assessment.',
   'Everyday situations with clear, practical information.'),
  ('<p class="notice">This page describes an everyday situation, not a diagnosis. The same situation can have several explanations, and a professional assessment is what distinguishes between them.</p>',''),
 ],
 'es/tramites/directorio/index.html':[
  ('Todo lo que puedes pedir, con su nombre oficial.','Directorio de ayudas'),
  ('Elige el país, tu territorio y lo que necesitas. Cada ficha dice cuánto es, quién puede pedirlo, qué papeles hacen falta y lleva a la página oficial.',
   'Busca por país, territorio o tipo de ayuda.'),
 ],
}

FORBIDDEN=[
 'Cada una dice qué ayuda, qué no está demostrado y en qué documento se apoya.',
 'All 185 entries are mounted, in all three languages.',
 'Esta página describe una situación del día a día, no un diagnóstico.',
 'This page describes an everyday situation, not a diagnosis.',
 'Todo lo que puedes pedir, con su nombre oficial.',
]

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    changed=0
    for rel,repls in REPLACEMENTS.items():
        p=root/rel
        if not p.is_file():
            raise FileNotFoundError(p)
        text=p.read_text(encoding='utf-8')
        before=text
        for old,new in repls:
            text=text.replace(old,new)
        if text!=before:
            p.write_text(text,encoding='utf-8')
            changed+=1
    remaining=[]
    for rel in REPLACEMENTS:
        text=(root/rel).read_text(encoding='utf-8')
        for phrase in FORBIDDEN:
            if phrase in text:
                remaining.append((rel,phrase))
    if remaining:
        raise AssertionError('Verbose/internal header copy remains: '+repr(remaining[:8]))
    print({'issue_369_headers':'PASS','routes':len(REPLACEMENTS),'changed':changed})

if __name__=='__main__':
    main()
