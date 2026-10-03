#!/usr/bin/env python3
from pathlib import Path
import argparse,re

def need(v,msg):
    if not v: raise AssertionError(msg)

def check(path,lang):
    txt=path.read_text(encoding='utf-8')
    prefix='ES' if lang=='es' else 'EN'

    # P4 · only three public age choices; GENERAL/ALL_AGES remain internal states.
    need(txt.count('data-ig-audience-stage=')==3,prefix+' public age choices !=3')
    need('data-ig-audience-stage="GENERAL"' not in txt,prefix+' GENERAL exposed')
    need('data-ig-audience-stage="ALL_AGES"' not in txt,prefix+' ALL_AGES exposed')

    # P5-P7 · approved Home labels.
    labels=(('Buscar','Explora','Información y recursos') if lang=='es'
            else ('Search','Explore','Information and resources'))
    for label in labels:
        need(label in txt,prefix+' missing Home label '+label)

    # P10 · one canonical visual-support entry, no duplicate routines card.
    visual=('Pictogramas y apoyos visuales' if lang=='es' else 'Pictograms and visual supports')
    need(txt.count('>'+visual+'<')==1,prefix+' visual-support Home card count !=1')
    standalone=('>Rutinas<' if lang=='es' else '>Routines<')
    need(standalone not in txt,prefix+' duplicate standalone routines card remains')

    # Home keeps exactly four action cards in Explora.
    need(txt.count('ig-home-v4-use-card')==4,prefix+' Explore action cards !=4')

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    check(root/'index.html','es')
    check(root/'en/index.html','en')
    print('ISSUE_369_P4_P7_P10_HOME_ARCHITECTURE_PASS')

if __name__=='__main__':main()
