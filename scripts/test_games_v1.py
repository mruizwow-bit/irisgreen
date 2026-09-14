#!/usr/bin/env python3
"""Guardarraíl del marco y mecánicas aprobadas de los 13 juegos interactivos."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path

GAMES=(
'cada-cerebro-su-camino','donde-se-fue-la-energia','el-archivo-de-capacidades','el-aula-al-reves',
'el-detective-de-los-sentidos','el-mapa-del-tesoro-de-casa','el-traductor-de-casa','el-traductor-de-instrucciones',
'la-cena-de-los-planes','la-consulta','la-maquina-de-empezar','las-cinco-cosas','palabra-misteriosa')
BANNED_COLORS=('#1f8ba8','#16708a','#8a5a12','#435268','#5d6779','#5a6675')
VERA_ES=('El ruido de la clase','El tubo de luz','El plan tachado','La etiqueta del jersey','La fila apretada')
VERA_EN=('The noise from the classroom','The light tube','The crossed-out plan','The jumper label','The tight queue')
NOJS_END='<!-- ig-sin-js:end -->'

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args();root=args.root.resolve()
    pages=[]
    for slug in GAMES:
        path=root/'es/recursos/juegos'/slug/'index.html';text=path.read_text(encoding='utf-8');pages.append((slug,text))
        if NOJS_END not in text:raise AssertionError(f'{slug}: falta límite del fallback')
        active=text.split(NOJS_END,1)[1]
        for asset in ('/assets/tokens-accesibilidad.css','/assets/games-v1.css','/assets/games-v1.js'):
            if asset not in text:raise AssertionError(f'{slug}: falta {asset}')
        if 'data-ig-game-v1="true"' not in active or 'data-rol="principal"' not in active:raise AssertionError(f'{slug}: marco o rol principal ausente del runtime activo')
        how=re.search(r'<ol\b[^>]*\bclass=["\'][^"\']*\bhow\b[^"\']*["\'][^>]*data-rol=["\']orientacion["\'][^>]*>(.*?)</ol>',active,re.I|re.S)
        if not how or len(re.findall(r'<li\b',how.group(1),re.I))!=3:raise AssertionError(f'{slug}: Cómo se juega no tiene tres pasos reales')
        if 'data-rol="decision"' not in active or 'data-ig-game-bar' not in active:raise AssertionError(f'{slug}: barra de decisión ausente del runtime activo')
        if len(re.findall(r'role=["\']status["\']',active,re.I))!=1:raise AssertionError(f'{slug}: debe haber una región role=status en el runtime activo')
        if re.search(r'role=["\']progressbar["\']|\bsetInterval\s*\(|\bdraggable\s*=',active,re.I):raise AssertionError(f'{slug}: patrón de juicio/tiempo/arrastre prohibido')
        low=active.casefold()
        if 'prueba otra vez' in low or 'try again' in low or 'eso es lo normal' in low or 'that is normal' in low:raise AssertionError(f'{slug}: lenguaje de juicio pendiente')
        for color in BANNED_COLORS:
            if color in low:raise AssertionError(f'{slug}: color retirado {color}')
    css=(root/'assets/games-v1.css').read_text(encoding='utf-8')
    if 'min-height:44px' not in css or 'focus-visible' not in css:raise AssertionError('Falta guardarraíl de objetivos/foco en juegos')
    sprite=root/'assets/runtime/ig-icons.fa4be0c21d6c.svg';s=sprite.read_text(encoding='utf-8')
    if s.count('<symbol ')!=35 or '<metadata' in s.casefold():raise AssertionError('Sprite: deben ser 35 símbolos y sin metadata')
    fixed=set(re.findall(r'#[0-9a-fA-F]{3,8}\b',s))
    if fixed:raise AssertionError(f'Sprite con colores fijos: {sorted(fixed)}')
    detective=dict(pages)['el-detective-de-los-sentidos']
    for needle in ('aria-pressed="{{ c.pressed }}"','data-ig-destination','undoStack','¿Dónde pongo «'):
        if needle not in detective:raise AssertionError(f'Detective: falta {needle}')
    vera=dict(pages)['las-cinco-cosas']
    for name in VERA_ES+VERA_EN:
        if name not in vera:raise AssertionError(f'Vera: nombre real ausente: {name}')
    if 'Prefiero la lista' not in vera or 'data-ig-list="true"' not in vera.split(NOJS_END,1)[1]:raise AssertionError('Vera: falta alternativa de lista')
    machine=dict(pages)['la-maquina-de-empezar']
    if 'const VALID' in machine or 'isValid' in machine:raise AssertionError('Máquina: sigue existiendo un orden modelo VALID')
    if 'Otras maneras que hemos visto' not in machine:raise AssertionError('Máquina: falta bloque bajo demanda')
    collection=json.loads((root/'es/recursos/juegos/juegos-120.json').read_text(encoding='utf-8'))
    if collection.get('total')!=130 or len(collection.get('juegos',[]))!=130:raise AssertionError('Colección: total no es 130')
    if 'porCondicion' in collection or len(collection.get('bloques',{}))!=13:raise AssertionError('Colección: bloques incorrectos')
    raw=json.dumps(collection,ensure_ascii=False)
    if 'Prompt' in raw or 'prompt' in raw.casefold():raise AssertionError('Colección: quedan campos Prompt')
    casa=next(g for g in collection['juegos'] if g.get('titulo')=='LA CASA CON EL VOLUMEN BAJADO')
    c=casa['campos']
    if 'siete detalles' not in c.get('Mecánica','') or 'Los siete' not in c.get('Solución','') or 'Siete de siete' not in c.get('Hotspots',''):raise AssertionError('La casa con el volumen bajado no está coherente en 7/7')
    print(json.dumps({'games':13,'common_frame':13,'detective':'classify+undo','vera':'scene+list+expand','maquina':'order_without_model','collection':130,'result':'accepted'},ensure_ascii=False))

if __name__=='__main__':main()
