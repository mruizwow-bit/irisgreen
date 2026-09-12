#!/usr/bin/env python3
"""Corrige la ficha pública ES/EN de discalculia/disgrafía sin inventar una prevalencia global.

Fuentes:
- Dowker 2024: sigue abierto el debate sobre definición y frecuencia de la discalculia.
- Blenis 2026: revisión integradora de disgrafía con desacuerdo definitorio y estimaciones variables.

Solo actúa sobre dist.
"""
from __future__ import annotations
import argparse
from pathlib import Path

PAGES={
'es/datos/discalculia-y-disgrafia-por-que-no-damos-una-cifra-mundial-unica/index.html':{
'old_intro':'La literatura usa definiciones, pruebas, edades y umbrales diferentes. Existen rangos ampliamente repetidos, pero la búsqueda realizada para esta ampliación no encontró una estimación internacional reciente con una solidez comparable a las seleccionadas para TDAH, dislexia o trastorno del desarrollo de la coordinación.',
'new_intro':'Las revisiones disponibles usan definiciones, pruebas, edades y umbrales diferentes. En discalculia todavía se debate cómo definir la condición y con qué frecuencia aparece; en disgrafía tampoco existe una definición consensuada y las estimaciones publicadas varían mucho. Por eso no mostramos un único porcentaje mundial para ninguna de las dos.',
'old_heading':'La conclusión publicable','new_heading':'Qué podemos afirmar',
'old_conclusion':'La evidencia localizada utiliza definiciones, pruebas, edades y umbrales diferentes. La decisión editorial es no convertir esa variación en un único porcentaje mundial hasta disponer de una síntesis internacional reciente y metodológicamente comparable.',
'new_conclusion':'Las cifras cambian según la definición, la prueba, la edad y el punto de corte utilizados. Un solo porcentaje ocultaría esas diferencias y daría una precisión que la evidencia actual no permite.',
'old_cite':'La conclusión publicable es precisamente que no se selecciona una cifra mundial única. No rellenes este bloque con rangos de páginas divulgativas sin metodología comparable.',
'new_cite':'Esta página no ofrece una prevalencia global. Explica que las estimaciones disponibles no son directamente comparables y por qué no se combinan en un único porcentaje.',
'old_avoid':'La cifra debe mantenerse unida a su población, territorio, año y método. Separarla de ese contexto puede cambiar su significado.',
'new_avoid':'No uses un rango de prevalencia como si procediera de una única estimación mundial. Las cifras dependen de la definición, la prueba, la edad y el punto de corte de cada estudio.',
'anchor':'<section class="sec consult"><h2>Ficha técnica</h2>','source_heading':'<h2>Fuentes</h2>',
'sources':'<section class="sec"><h2>Fuentes</h2><ul class="fuentes"><li><a href="https://pubmed.ncbi.nlm.nih.gov/38929203/" rel="noopener" target="_blank">Dowker, A. · Developmental Dyscalculia in Relation to Individual Differences in Mathematical Abilities · 2024</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/42470314/" rel="noopener" target="_blank">Blenis, R. C. · Developmental Dysgraphia in Child and Adolescent Psychiatric-Mental Health Nursing: An Integrative Review · 2026</a></li></ul></section>'},
'en/data/dyscalculia-and-dysgraphia-why-we-do-not-give-a-single-global-figure/index.html':{
'old_intro':'The literature uses different definitions, tests, ages and thresholds. Widely repeated ranges exist, but the search carried out for this expansion did not find a recent international estimate with robustness comparable to the sources selected for ADHD, dyslexia or developmental coordination disorder.',
'new_intro':'Available reviews use different definitions, tests, ages and thresholds. For dyscalculia, its definition and frequency are still debated; for dysgraphia, there is also no single agreed definition and published estimates vary widely. For that reason, we do not give one worldwide percentage for either condition.',
'old_heading':'The publishable conclusion','new_heading':'What we can say',
'old_conclusion':'The evidence located uses different definitions, tests, ages and thresholds. The editorial decision is not to turn that variation into a single worldwide percentage until a recent international synthesis with comparable methodology is available.',
'new_conclusion':'Estimates change with the definition, test, age group and cut-off used. A single percentage would hide those differences and imply more precision than the current evidence supports.',
'old_cite':'The publishable conclusion is precisely that no single global figure is selected. Do not fill this block with ranges from general-information pages that lack comparable methodology.',
'new_cite':'This page does not provide a global prevalence estimate. It explains why the available estimates are not directly comparable and why they are not combined into one percentage.',
'old_avoid':'The figure must remain linked to its population, territory, year and method. Separating it from that context can change its meaning.',
'new_avoid':'Do not treat a prevalence range as if it came from one worldwide estimate. Figures depend on the definition, test, age group and cut-off used in each study.',
'anchor':'<section class="sec consult"><h2>Technical sheet</h2>','source_heading':'<h2>Sources</h2>',
'sources':'<section class="sec"><h2>Sources</h2><ul class="fuentes"><li><a href="https://pubmed.ncbi.nlm.nih.gov/38929203/" rel="noopener" target="_blank">Dowker, A. · Developmental Dyscalculia in Relation to Individual Differences in Mathematical Abilities · 2024</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/42470314/" rel="noopener" target="_blank">Blenis, R. C. · Developmental Dysgraphia in Child and Adolescent Psychiatric-Mental Health Nursing: An Integrative Review · 2026</a></li></ul></section>'}}

def once(text,old,new,rel):
    if new in text:return text
    if text.count(old)!=1:raise ValueError(f'Texto esperado no encontrado exactamente una vez en {rel}: {old[:70]}')
    return text.replace(old,new,1)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args();root=args.root.resolve();changed=[]
    for rel,cfg in PAGES.items():
        p=root/rel
        if not p.is_file():raise FileNotFoundError(p)
        old=p.read_text(encoding='utf-8');text=old
        for key in ('intro','heading','conclusion','cite','avoid'):text=once(text,cfg['old_'+key],cfg['new_'+key],rel)
        if cfg['source_heading'] not in text:
            if text.count(cfg['anchor'])!=1:raise ValueError(f'Punto de inserción no encontrado en {rel}')
            text=text.replace(cfg['anchor'],cfg['sources']+cfg['anchor'],1)
        if text!=old:p.write_text(text,encoding='utf-8');changed.append(rel)
    print({'paginas_actualizadas':changed,'fuentes':['PMID 38929203','PMID 42470314']})

if __name__=='__main__':main()
