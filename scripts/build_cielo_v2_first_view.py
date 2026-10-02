#!/usr/bin/env python3
"""Deriva el subconjunto del primer viewport de Cielo V2 desde cielo.json.

No sustituye el depth completo. Conserva 240 estrellas HYG brillantes y una
selección distribuida de constelaciones IAU suficiente para la escena inicial.
"""
from __future__ import annotations
import argparse, json
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
SOURCE=ROOT/'es/intereses/cielo/cielo.json'
TARGET=ROOT/'assets/data/cielo-v2-first-view.json'

def build():
    d=json.loads(SOURCE.read_text(encoding='utf-8'))
    raw=sorted(d['estrellas'],key=lambda s:s[2])[:240]
    stars=[{
        'ra':s[0],'dec':s[1],'mag':s[2],'ci':s[3],
        'con':s[4] or '','designation':s[5] or '','name':s[6] or '',
        'ly':s[7] if s[7] is not None else None,'sp':s[8] or ''
    } for s in raw]
    best={}
    for s in stars:
        if s['con']:
            best[s['con']]=min(best.get(s['con'],99),s['mag'])
    candidates=[]
    for c in d['constelaciones']:
        if c['abbr'] not in best or c['label'][1] <= -45:
            continue
        candidates.append((int(((c['label'][0]%24)+24)%24//2),best[c['abbr']],c))
    picked=[]
    for bin_id in range(12):
        group=sorted((x for x in candidates if x[0]==bin_id),key=lambda x:x[1])[:2]
        picked.extend(group)
    picked.sort(key=lambda x:x[2]['label'][0])
    constellations=[{
        'abbr':c['abbr'],'latin':c['latin'],'en':c['en'],'es':c['es'],
        'label':c['label'],'lines':c['lines'],'best_month':c['mes'],
        'meaning_es':c.get('sig_es',''),'bright':c.get('bright')
    } for _,_,c in picked]
    return {
        'schema':'iris-green/cielo-v2-first-view/v1',
        'interest_id':'01',
        'runtime':'LOCAL_SNAPSHOT',
        'default_place':{
            'id':'peninsula-40n',
            'label':{'es':'Península · 40° N','en':'Mainland Spain · 40° N'},
            'lat':40,'lon':-3.7
        },
        'depth_url':'/es/intereses/cielo/cielo.json',
        'target_count':18,
        'max_constellation_labels':5,
        'stars':stars,
        'constellations':constellations,
        'sources':{
            'HYG':{'role':'star position, apparent magnitude and colour index','mode':'SNAPSHOT_LOCAL','source':d['fuentes']['estrellas']},
            'IAU':{'role':'constellation identities and official star names','mode':'SNAPSHOT_LOCAL','source':d['fuentes']['nombres']+' · '+d['fuentes']['constelaciones']},
            'JPL':{'role':'approximate planetary positions','mode':'LOCAL_FORMULA','range':'1800–2050','source':'JPL approximate Keplerian elements already used by Iris Green donor runtime'}
        },
        'forbidden':{'NASA':True,'external_network':True,'automatic_geolocation':True}
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--check',action='store_true')
    args=ap.parse_args()
    built=build()
    if args.check:
        current=json.loads(TARGET.read_text(encoding='utf-8'))
        if current!=built:
            raise SystemExit('Cielo V2 first-view data drifted from cielo.json')
        print(json.dumps({'status':'PASS','stars':len(built['stars']),'constellations':len(built['constellations'])},ensure_ascii=False))
        return
    TARGET.write_text(json.dumps(built,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(TARGET)

if __name__=='__main__':
    main()
