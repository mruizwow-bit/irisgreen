#!/usr/bin/env python3
"""Prepara el JSON público de la colección de juegos dentro del staging del build."""
from __future__ import annotations
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PATH=ROOT/'es/recursos/juegos/juegos-120.json'

def strip_prompts(value):
    removed=0
    if isinstance(value,dict):
        for key in list(value):
            if 'prompt' in key.casefold():
                del value[key];removed+=1
            else:
                removed+=strip_prompts(value[key])
    elif isinstance(value,list):
        for item in value:removed+=strip_prompts(item)
    return removed

def main():
    data=json.loads(PATH.read_text(encoding='utf-8'))
    games=data.get('juegos',[])
    if len(games)!=130:raise AssertionError(f'Colección: esperados 130 juegos; encontrados {len(games)}')
    data['total']=130
    note=str(data.get('note',''))
    data['note']=note.replace('Los 120 juegos','Los 130 juegos').replace('120 juegos','130 juegos')
    if 'porCondicion' in data:
        if 'bloques' in data:raise AssertionError('No pueden coexistir porCondicion y bloques')
        data['bloques']=data.pop('porCondicion')
    if len(data.get('bloques',{}))!=13 or sum(data['bloques'].values())!=130:
        raise AssertionError('Los 13 bloques no suman 130 juegos')
    removed=strip_prompts(data)
    target=next((g for g in games if str(g.get('titulo','')).upper()=='LA CASA CON EL VOLUMEN BAJADO'),None)
    if target is None:raise AssertionError('No se encontró La casa con el volumen bajado')
    campos=target.get('campos',{})
    campos['Mecánica']=str(campos.get('Mecánica','')).replace('ocho detalles','siete detalles').replace('Ocho detalles','Siete detalles')
    campos['Solución']=str(campos.get('Solución','')).replace('Los ocho','Los siete').replace('los ocho','los siete')
    if 'Siete de siete' not in str(campos.get('Hotspots','')):raise AssertionError('La ficha debe conservar siete hotspots')
    serialized=json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n'
    if 'Prompt' in serialized or 'prompt' in serialized.casefold():raise AssertionError('Quedan campos Prompt en el JSON público')
    PATH.write_text(serialized,encoding='utf-8')
    print(json.dumps({'collection_total':130,'blocks':13,'prompt_fields_removed':removed,'casa_volumen':'7/7'},ensure_ascii=False))

if __name__=='__main__':main()
