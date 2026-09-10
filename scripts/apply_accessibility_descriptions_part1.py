#!/usr/bin/env python3
"""Apply the author's approved accessibility copy for Situaciones, part 1.

Approved source: irisgreen_420_descripciones_ACCESIBILIDAD_ES_EN_PARTE_1_DE_3.md
Source SHA-256: 6e2ce6410da55687434b28d62dd915d6035ebf4557324e1e15e175a05db5a031
Scope: 141 Spanish titles and 282 ES/EN descriptions. Existing English titles,
URLs, clinical sections, sources, controls and styles are preserved.
"""
from __future__ import annotations
import argparse, base64, html, json, re, zlib
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from apply_reviewed_entries import Tree, has, within, edits

REPO_ROOT=Path(__file__).resolve().parents[1]
SOURCE_NAME='irisgreen_420_descripciones_ACCESIBILIDAD_ES_EN_PARTE_1_DE_3.md'
SOURCE_SHA256='6e2ce6410da55687434b28d62dd915d6035ebf4557324e1e15e175a05db5a031'
AREAS=[('Sentidos',24),('Sueño',23),('Comunicación',23),('Alimentación',23),('Preocupación y comprobaciones',24),('Relaciones',24)]
INDEXES={'es':'es/situaciones/index.html','en':'en/situations/index.html'}
DATA_FILES=[REPO_ROOT/f'scripts/data/accessibility-descriptions-part1-{i:02d}.b64' for i in range(1,5)]

def payload_b64():
    return ''.join(p.read_text(encoding='utf-8').strip() for p in DATA_FILES)

def rows():
    out=json.loads(zlib.decompress(base64.b64decode(payload_b64())).decode('utf-8'))
    if len(out)!=141: raise ValueError(f'Expected 141 approved entries, got {len(out)}')
    for area,count in AREAS:
        got=[r['number'] for r in out if r['area']==area]
        if got!=list(range(1,count+1)): raise ValueError(f'Invalid approved sequence for {area}')
    return out

def esc(s): return html.escape(s,quote=True)
def one(nodes,label):
    found=list(nodes)
    if len(found)!=1: raise ValueError(f'{label}: expected one match, got {len(found)}')
    return found[0]
def file_from_route(route):
    p=route.lstrip('/')
    if not p.endswith('/'): p+='/'
    return p+'index.html'

def page_nodes(text):
    t=Tree(text)
    articles=[n for n in t.nodes if n.tag=='article' and has(n,'ficha')]
    if len(articles)==1:
        article=articles[0]
        title=one((n for n in t.nodes if n.tag=='h1' and within(n,article)),'page h1')
        lead=one((n for n in t.nodes if n.tag=='p' and has(n,'lede') and within(n,article)),'page description')
        return t,title,lead
    # The approved navigation template for the instructions entry deliberately
    # uses a different presentation shell. Treat its visible brief as the lede
    # without touching the rest of the approved interactive page.
    title=one((n for n in t.nodes if n.tag=='h1' and n.attrs.get('id')=='instruction-title'),'approved navigation h1')
    brief=one((n for n in t.nodes if n.tag=='section' and has(n,'brief-box')),'approved navigation brief')
    lead=one((n for n in t.nodes if n.tag=='p' and within(n,brief)),'approved navigation description')
    return t,title,lead

def inside(text,node,value):
    end=text.rfind('</',node.opening_end,node.end)
    if end<node.opening_end: raise ValueError('Missing closing tag')
    return node.opening_end,end,esc(value)

def page_update(text,row,lang):
    t,title,lead=page_nodes(text); changes=[inside(text,lead,row[lang])]
    if lang=='es': changes.append(inside(text,title,row['title_es']))
    for n in t.nodes:
        if lang=='es' and n.tag=='title': changes.append(inside(text,n,row['title_es']))
        if n.tag=='meta':
            name=n.attrs.get('name'); prop=n.attrs.get('property'); value=None
            if name in {'description','twitter:description'} or prop=='og:description': value=row[lang]
            if lang=='es' and (name=='twitter:title' or prop=='og:title'): value=row['title_es']
            if value is not None:
                tag=text[n.start:n.end]
                tag,count=re.subn(r'content=([\"\']).*?\1',lambda m:'content="'+esc(value)+'"',tag,count=1,flags=re.S)
                if count!=1: raise ValueError('Unrecognised metadata')
                changes.append((n.start,n.end,tag))
        if n.tag=='script' and n.attrs.get('type')=='application/ld+json':
            stop=text.rfind('</script',n.start,n.end)
            obj=json.loads(text[n.opening_end:stop]); touched=False
            items=obj.get('@graph',[]) if isinstance(obj,dict) and '@graph' in obj else [obj]
            for item in items:
                if not isinstance(item,dict): continue
                if item.get('@type')=='WebPage':
                    item['description']=row[lang]
                    if lang=='es': item['name']=row['title_es']
                    touched=True
                if lang=='es' and item.get('@type')=='BreadcrumbList' and item.get('itemListElement'):
                    item['itemListElement'][-1]['name']=row['title_es']; touched=True
            if touched: changes.append((n.opening_end,stop,json.dumps(obj,ensure_ascii=False,separators=(',',':'))))
    return edits(text,changes)

def card_nodes(text,index_path):
    t=Tree(text); cards=[]
    for n in t.nodes:
        if n.tag!='a' or not has(n,'card'): continue
        url=urlsplit(urljoin('https://irisgreen.eu/'+index_path,n.attrs.get('href',''))).path
        children=[c for c in t.nodes if c.parent==n]
        title=one((c for c in children if c.tag=='strong'),'card title')
        lead=one((c for c in children if c.tag=='span' and not has(c,'chip') and not has(c,'chiprow')),'card description')
        cards.append({'url':url,'area':n.attrs.get('data-area',''),'title':title,'lead':lead})
    return t,cards

def map_routes(root,approved):
    rel=INDEXES['es']; text=(root/rel).read_text(encoding='utf-8'); _,cards=card_nodes(text,rel)
    for area,expected in AREAS:
        cs=[c for c in cards if c['area']==area]; rs=[r for r in approved if r['area']==area]
        if len(cs)!=expected: raise ValueError(f'{area}: catalogue has {len(cs)} cards, expected {expected}')
        for row,card in zip(rs,cs):
            row['es_route']=card['url']; row['es_path']=file_from_route(card['url'])
            es=(root/row['es_path']).read_text(encoding='utf-8'); t,_,_=page_nodes(es)
            link=one((n for n in t.nodes if n.tag=='a' and n.attrs.get('lang')=='en' and has(n,'lang')),'English counterpart')
            er=urlsplit(urljoin('https://irisgreen.eu/'+row['es_path'],link.attrs['href'])).path
            if not er.startswith('/en/situations/'): raise ValueError('Invalid English counterpart: '+er)
            row['en_route']=er; row['en_path']=file_from_route(er)
            en=(root/row['en_path']).read_text(encoding='utf-8'); et,eh,_=page_nodes(en); row['title_en']=et.text(eh)
    if len({r['es_path'] for r in approved})!=141 or len({r['en_path'] for r in approved})!=141: raise ValueError('Duplicate route mapping')
    return approved

def index_update(text,path,approved,lang):
    _,cards=card_nodes(text,path); by={c['url']:c for c in cards}; changes=[]
    for row in approved:
        c=by[row[lang+'_route']]; changes.append(inside(text,c['lead'],row[lang]))
        if lang=='es': changes.append(inside(text,c['title'],row['title_es']))
    return edits(text,changes)

def search_update(text,approved):
    data=json.loads(text); by={r['es_route']:r for r in approved}; count=0
    for item in data:
        row=by.get(item.get('u'))
        if not row: continue
        if item.get('a')!=row['area'] or item.get('en',{}).get('u')!=row['en_route']: raise ValueError('Search mapping mismatch: '+str(item.get('u')))
        item['t']=row['title_es']; item['d']=row['es']; item['en']['d']=row['en']; count+=1
    if count!=141: raise ValueError(f'Updated {count} search records, expected 141')
    return json.dumps(data,ensure_ascii=False,indent=2)+'\n'

def check(root,approved=None):
    approved=approved or map_routes(root,rows())
    indexes={}
    for lang,rel in INDEXES.items():
        text=(root/rel).read_text(encoding='utf-8'); t,cards=card_nodes(text,rel); indexes[lang]=(text,t,{c['url']:c for c in cards})
    search={x.get('u'):x for x in json.loads((root/'buscador.json').read_text(encoding='utf-8'))}
    for row in approved:
        for lang in ('es','en'):
            path=root/row[lang+'_path']; text=path.read_text(encoding='utf-8'); t,h,lead=page_nodes(text)
            expected=row['title_es'] if lang=='es' else row['title_en']
            if t.text(h)!=expected or t.text(lead)!=row[lang]: raise ValueError('Approved wording mismatch: '+str(path))
            desc=[n.attrs.get('content') for n in t.nodes if n.tag=='meta' and (n.attrs.get('name')=='description' or n.attrs.get('property')=='og:description')]
            if desc!=[row[lang],row[lang]]: raise ValueError('Stale metadata: '+str(path))
            _,it,by=indexes[lang]; c=by[row[lang+'_route']]
            if it.text(c['title'])!=expected or it.text(c['lead'])!=row[lang]: raise ValueError('Stale catalogue card: '+str(path))
        rec=search.get(row['es_route'])
        if not rec or rec.get('t')!=row['title_es'] or rec.get('d')!=row['es'] or rec.get('en',{}).get('d')!=row['en']: raise ValueError('Stale search record: '+row['es_route'])
    return {'source':SOURCE_NAME,'source_sha256':SOURCE_SHA256,'entries':141,'descriptions':282,'spanish_titles':141,'english_titles':'preserved','pages_checked':282,'catalogue_cards_checked':282,'search_records_checked':141}

def apply(root):
    approved=map_routes(root,rows())
    for row in approved:
        for lang in ('es','en'):
            p=root/row[lang+'_path']; p.write_text(page_update(p.read_text(encoding='utf-8'),row,lang),encoding='utf-8')
    for lang,rel in INDEXES.items():
        p=root/rel; p.write_text(index_update(p.read_text(encoding='utf-8'),rel,approved,lang),encoding='utf-8')
    p=root/'buscador.json'; p.write_text(search_update(p.read_text(encoding='utf-8'),approved),encoding='utf-8')
    return check(root,approved)

def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument('--root',type=Path,default=REPO_ROOT); ap.add_argument('--apply',action='store_true'); args=ap.parse_args()
    result=apply(args.root.resolve()) if args.apply else check(args.root.resolve())
    print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
