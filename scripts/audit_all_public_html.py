#!/usr/bin/env python3
"""Puerta estructural para TODO el HTML público generado.

Comprueba fallos objetivos relacionados con WCAG 2.2/ISO/IEC 40500:2025 y
calidad del documento HTML. No sustituye las comprobaciones manuales de WCAG,
la evaluación WCAG-EM completa ni una certificación externa.
"""
from __future__ import annotations
import json
import re
import sys
from collections import Counter
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]
TARGET=(Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT/'dist')
OUT=ROOT/'reports/standards';OUT.mkdir(parents=True,exist_ok=True)

FOCUSABLE={'a','button','input','select','textarea','summary','iframe'}
INPUT_EXEMPT={'hidden','submit','reset','button','image'}

class Doc(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=False)
        self.text=text;self.html_attrs={};self.title=[];self.in_title=False;self.main=0;self.h1=0
        self.ids=[];self.img=[];self.iframes=[];self.inputs=[];self.labels_for=set();self.buttons=[];self.anchors=[]
        self.video=[];self.audio=[];self.metas=[];self.positive_tabindex=[];self.aria_hidden_focusable=[];self.stack=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.stack.append(tag)
        if tag=='html':self.html_attrs=a
        if tag=='title':self.in_title=True
        if tag=='main':self.main+=1
        if tag=='h1':self.h1+=1
        if 'id' in a:self.ids.append(a['id'])
        if tag=='img':self.img.append(a)
        if tag=='iframe':self.iframes.append(a)
        if tag=='input':self.inputs.append(a)
        if tag=='label' and a.get('for'):self.labels_for.add(a['for'])
        if tag=='button':self.buttons.append({'attrs':a,'text':''})
        if tag=='a':self.anchors.append({'attrs':a,'text':''})
        if tag=='video':self.video.append(a)
        if tag=='audio':self.audio.append(a)
        if tag=='meta':self.metas.append(a)
        try:
            ti=int(a.get('tabindex','0'))
            if ti>0:self.positive_tabindex.append((tag,ti))
        except ValueError:pass
        if a.get('aria-hidden','').lower()=='true' and (tag in FOCUSABLE or 'tabindex' in a):self.aria_hidden_focusable.append(tag)
    def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
        if self.stack:
            for i in range(len(self.stack)-1,-1,-1):
                if self.stack[i]==tag:
                    del self.stack[i:];break
    def handle_data(self,data):
        if self.in_title:self.title.append(data)
        for seq in (self.buttons,self.anchors):
            if seq and seq[-1]['attrs'].get('_closed')!='1':seq[-1]['text']+=data
    def get_starttag_text(self):return super().get_starttag_text()

# Text collection for buttons/links needs a small second parser with element-depth tracking.
class Names(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.stack=[];self.buttons=[];self.anchors=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);node={'tag':tag,'attrs':a,'text':'','img_alts':[]}
        for parent in self.stack:
            if parent['tag'] in ('button','a') and tag=='img':parent['img_alts'].append(a.get('alt',''))
        self.stack.append(node)
    def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
    def handle_data(self,data):
        for n in self.stack:
            if n['tag'] in ('button','a'):n['text']+=data
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag']==tag:
                closing=self.stack[i:];del self.stack[i:]
                n=closing[0]
                if n['tag']=='button':self.buttons.append(n)
                elif n['tag']=='a':self.anchors.append(n)
                break

def accessible_name(node):
    a=node['attrs']
    return ' '.join(x.strip() for x in [a.get('aria-label',''),a.get('title',''),node.get('text',''),*node.get('img_alts',[])] if x and x.strip()).strip()

def expected_lang(rel):
    if rel.startswith('es/'):return 'es'
    if rel.startswith('en/'):return 'en'
    return None

def audit(path):
    rel=path.relative_to(TARGET).as_posix();text=path.read_text(encoding='utf-8',errors='replace');d=Doc(text);d.feed(text);n=Names();n.feed(text)
    errors=[];warnings=[]
    def err(code,detail=''):errors.append({'code':code,'detail':detail})
    def warn(code,detail=''):warnings.append({'code':code,'detail':detail})
    lang=d.html_attrs.get('lang','').strip().lower()
    if not lang:err('html-lang-missing')
    exp=expected_lang(rel)
    if exp and lang and not lang.startswith(exp):err('html-lang-route-mismatch',f'{lang} vs {exp}')
    title=unescape(''.join(d.title)).strip()
    if not title:err('title-missing')
    viewport=next((m.get('content','') for m in d.metas if m.get('name','').lower()=='viewport'),None)
    if viewport is None:err('viewport-missing')
    elif re.search(r'user-scalable\s*=\s*no|maximum-scale\s*=\s*(?:0|1)(?:\.0+)?(?:\s|,|$)',viewport,re.I):err('zoom-disabled',viewport)
    # Redirect-only/error documents may still need landmarks for keyboard/screen-reader users.
    if d.main!=1:err('main-count',str(d.main))
    if d.h1<1:err('h1-missing')
    dup=[i for i,c in Counter(x for x in d.ids if x).items() if c>1]
    if dup:err('duplicate-id',', '.join(dup[:12]))
    for i,a in enumerate(d.img):
        if 'alt' not in a:err('img-alt-attribute-missing',str(i+1))
    for i,a in enumerate(d.iframes):
        if not (a.get('title') or '').strip():err('iframe-title-missing',str(i+1))
    for i,a in enumerate(d.inputs):
        typ=a.get('type','text').lower()
        if typ in INPUT_EXEMPT:continue
        named=bool((a.get('aria-label') or '').strip() or (a.get('aria-labelledby') or '').strip() or (a.get('id') and a['id'] in d.labels_for))
        if not named:err('form-control-name-missing',f'input {i+1} type={typ}')
    for i,node in enumerate(n.buttons):
        if not accessible_name(node):err('button-name-missing',str(i+1))
    for i,node in enumerate(n.anchors):
        if not node['attrs'].get('href'):continue
        if not accessible_name(node):err('link-name-missing',str(i+1))
    for i,a in enumerate(d.audio+d.video):
        if 'autoplay' in a and not ('muted' in a):err('unmuted-autoplay',str(i+1))
    if d.positive_tabindex:err('positive-tabindex',str(d.positive_tabindex[:8]))
    if d.aria_hidden_focusable:err('aria-hidden-focusable',', '.join(d.aria_hidden_focusable[:8]))
    if '<marquee' in text.lower() or '<blink' in text.lower():err('obsolete-moving-content')
    # These need human judgement, so only record as warnings/inventory.
    if any(a.get('alt','')=='' for a in d.img):warn('empty-alt-present','verify decorative intent')
    if any(urlsplit(a.get('href','')).scheme in ('http','https') for a in (x['attrs'] for x in n.anchors)):warn('external-links-present','verify purpose/context where needed')
    return {'path':rel,'errors':errors,'warnings':warnings,'counts':{'images':len(d.img),'iframes':len(d.iframes),'inputs':len(d.inputs),'buttons':len(n.buttons),'links':len(n.anchors)}}

def main():
    files=sorted(TARGET.rglob('*.html'))
    assert files,'No HTML found under '+str(TARGET)
    results=[audit(p) for p in files]
    failed=[r for r in results if r['errors']]
    summary={
      'target':str(TARGET),'html_files':len(files),'passed_files':len(files)-len(failed),'failed_files':len(failed),
      'errors':sum(len(r['errors']) for r in results),'warnings':sum(len(r['warnings']) for r in results),
      'scope':'all generated public HTML, including noindex/error pages',
      'standard_reference':'ISO/IEC 40500:2025 / WCAG 2.2',
      'claim':'automated structural gate only; not a complete WCAG conformance evaluation or ISO certification'
    }
    report={'summary':summary,'failed':failed,'warning_pages':[r for r in results if r['warnings']]}
    (OUT/'all-public-html.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False))
    if failed:
        for r in failed[:30]:print(r['path'],r['errors'][:6])
        raise SystemExit(1)

if __name__=='__main__':main()
