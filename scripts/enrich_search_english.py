#!/usr/bin/env python3
"""Añade campos ingleses al mismo buscador.json a partir de las páginas EN existentes.
No crea un segundo índice ni traduce contenido por inferencia: usa títulos, entradillas,
áreas y rutas que ya existen en las páginas inglesas del repositorio.
"""
from __future__ import annotations
import html as htmlmod
import json
import posixpath
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT=Path(__file__).resolve().parents[1]
INDEX=ROOT/'buscador.json'
KIND={'Situación':'Situation','Condición':'Condition','Tema':'Topic','Vida diaria':'Everyday life','Datos':'Data','Ayudas':'Support','Trámite':'Support','Juego':'Game','Vídeo':'Video','Libro':'Book'}

def clean(value:str)->str:
    value=re.sub(r'<[^>]+>',' ',value,flags=re.S)
    return re.sub(r'\s+',' ',htmlmod.unescape(value)).strip()

def attr(tag:str,name:str):
    m=re.search(r'\b'+re.escape(name)+r'\s*=\s*(["\'])(.*?)\1',tag,re.I|re.S)
    return htmlmod.unescape(m.group(2)) if m else None

def extract_en_href(text:str):
    for tag in re.findall(r'<a\b[^>]*>',text,re.I|re.S):
        lang=(attr(tag,'lang') or '').lower()
        if lang.startswith('en'):
            href=attr(tag,'href')
            if href:return href
    for tag in re.findall(r'<link\b[^>]*>',text,re.I|re.S):
        if (attr(tag,'hreflang') or '').lower().startswith('en'):
            href=attr(tag,'href')
            if href:return href
    return None

def page_path(url_path:str)->Path:
    clean_path=urlparse(url_path).path.strip('/')
    return ROOT/'index.html' if not clean_path else ROOT/clean_path/'index.html'

def english_route(spanish_route:str,spanish_html:str):
    href=extract_en_href(spanish_html)
    if not href:return None
    absolute=urljoin('https://irisgreen.eu'+spanish_route,href)
    route=urlparse(absolute).path
    ep=page_path(route)
    if not ep.exists():return None
    text=ep.read_text(errors='replace')
    m=re.search(r'<html\b[^>]*\blang\s*=\s*["\']([^"\']+)',text,re.I)
    if not m or not m.group(1).lower().startswith('en'):return None
    return route,text

def extract_h1(text):
    m=re.search(r'<h1\b[^>]*>(.*?)</h1>',text,re.I|re.S)
    return clean(m.group(1)) if m else ''

def extract_lede(text):
    patterns=[r'<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>(.*?)</p>',r'<meta\b[^>]*name=["\']description["\'][^>]*>']
    m=re.search(patterns[0],text,re.I|re.S)
    if m:return clean(m.group(1))
    for tag in re.findall(r'<meta\b[^>]*>',text,re.I|re.S):
        if (attr(tag,'name') or '').lower()=='description':return clean(attr(tag,'content') or '')
    return ''

def extract_area(text):
    m=re.search(r'<p\b[^>]*class=["\'][^"\']*\bchips\b[^"\']*["\'][^>]*>(.*?)</p>',text,re.I|re.S)
    if not m:return ''
    chip=re.search(r'<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>(.*?)</span>',m.group(1),re.I|re.S)
    return clean(chip.group(1)) if chip else ''

def main():
    data=json.loads(INDEX.read_text())
    found=missing=0
    for item in data:
        route=item.get('u')
        if not isinstance(route,str) or not route.startswith('/'):continue
        sp=page_path(route)
        if not sp.exists():continue
        st=sp.read_text(errors='replace')
        pair=english_route(route,st)
        if not pair:
            missing+=1;continue
        eroute,et=pair
        title=extract_h1(et);desc=extract_lede(et)
        if not title or not desc:
            missing+=1;continue
        en={'s':KIND.get(item.get('s'),item.get('s','')),'t':title,'u':eroute,'d':desc}
        area=extract_area(et)
        if area:en['a']=area
        item['en']=en;found+=1
    INDEX.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'entries':len(data),'english_pairs':found,'without_existing_english_pair':missing},ensure_ascii=False))
    if found < 360:
        raise SystemExit('Se esperaban al menos 360 parejas inglesas existentes; no se guarda una cobertura incompleta.')
if __name__=='__main__':main()
