#!/usr/bin/env python3
"""Import only the author's Sueño descriptions; deployments CHECK, never rewrite.
The submitted Markdown remains the authoritative wording. New approvals must update
that source and its manifest together. English headings were not supplied: retain them.
"""
from __future__ import annotations
import argparse, hashlib, html, json, re
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from apply_reviewed_entries import Tree, has, within, edits

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'editorial/reviews/situaciones_sueno_ES_EN.md'
MANIFEST = 'editorial/reviews/situaciones-sueno-manifest.json'
SOURCE_SHA256 = 'd8df5797d04c1c854a6dbb01c222ab51d8f88bc987037adb9bd1c05b13400a9e'
INDEXES = {'es':'es/situaciones/index.html','en':'en/situations/index.html'}
AREA = {'es':'Sueño','en':'Sleep'}

def sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def esc(s: str) -> str:
    return html.escape(s, quote=True)

def one(nodes, label):
    found = list(nodes)
    if len(found) != 1: raise ValueError(f'{label}: expected one match, got {len(found)}')
    return found[0]

def route(path):
    return '/' + path.removesuffix('index.html')

def load_source():
    raw = (ROOT/SOURCE).read_bytes()
    if sha(raw) != SOURCE_SHA256:
        raise ValueError('Author source changed: obtain approval and update the protected source hash, never restore old prose automatically.')
    blocks = re.findall(r'^## (\d+)\. ([^\n]+)\n\n### ES\n([^\n]+)\n\n### EN\n([^\n]+)',raw.decode('utf-8'),re.M)
    if [int(x[0]) for x in blocks] != list(range(1,24)): raise ValueError('Expected all 23 complete ES/EN entries')
    return [{'number':int(i),'title_es':title,'es':es,'en':en} for i,title,es,en in blocks]

def page_nodes(text):
    t = Tree(text)
    article = one((n for n in t.nodes if n.tag=='article' and has(n,'ficha')), 'article')
    title = one((n for n in t.nodes if n.tag=='h1' and within(n,article)), 'title')
    lead = one((n for n in t.nodes if n.tag=='p' and has(n,'lede') and within(n,article)), 'description')
    return t, article, title, lead

def inside(text, node, value):
    end = text.rfind('</',node.opening_end,node.end)
    if end < node.opening_end: raise ValueError('No closing tag')
    return (node.opening_end,end,esc(value))

def page_update(text, row, lang):
    t, article, title, lead = page_nodes(text)
    changes = [inside(text,lead,row[lang])]
    if lang=='es': changes.append(inside(text,title,row['title_es']))
    for n in t.nodes:
        if lang=='es' and n.tag=='title': changes.append(inside(text,n,row['title_es']))
        if n.tag=='meta':
            value = None
            if n.attrs.get('name')=='description' or n.attrs.get('property')=='og:description': value=row[lang]
            if lang=='es' and n.attrs.get('property')=='og:title': value=row['title_es']
            if value is not None:
                tag=text[n.start:n.end]
                tag,count=re.subn(r'content=([\"\']).*?\1', lambda m:'content="'+esc(value)+'"',tag,count=1,flags=re.S)
                if count!=1: raise ValueError('Unrecognised metadata')
                changes.append((n.start,n.end,tag))
        if n.tag=='script' and n.attrs.get('type')=='application/ld+json':
            stop=text.rfind('</script',n.start,n.end)
            obj=json.loads(text[n.opening_end:stop])
            for item in obj.get('@graph',[]):
                if item.get('@type')=='WebPage':
                    item['description']=row[lang]
                    if lang=='es': item['name']=row['title_es']
                if lang=='es' and item.get('@type')=='BreadcrumbList':
                    for part in item['itemListElement']:
                        if part.get('item')=='https://irisgreen.eu'+route(row['es_path']): part['name']=row['title_es']
            changes.append((n.opening_end,stop,json.dumps(obj,ensure_ascii=False,separators=(',',':'))))
    return edits(text,changes)

def card_nodes(text, path):
    t=Tree(text); cards={}
    for n in t.nodes:
        if n.tag!='a' or not has(n,'card'): continue
        url=urlsplit(urljoin('https://irisgreen.eu/'+path,n.attrs.get('href',''))).path
        if url in cards: raise ValueError('Duplicate card: '+url)
        children=[c for c in t.nodes if c.parent==n]
        title=one((c for c in children if c.tag=='strong'), 'card title')
        lead=one((c for c in children if c.tag=='span' and not has(c,'chip') and not has(c,'chiprow')), 'card description')
        cards[url]=(n,title,lead)
    return t,cards

def index_update(text, path, rows, lang):
    t,cards=card_nodes(text,path);changes=[]
    for row in rows:
        _,title,lead=cards[route(row[lang+'_path'])]
        changes.append(inside(text,lead,row[lang]))
        if lang=='es': changes.append(inside(text,title,row['title_es']))
    return edits(text,changes)

def search_update(text, rows):
    by_url={route(r['es_path']):r for r in rows}; count=0; patches=[]
    decoder=json.JSONDecoder();pos=text.index('[')+1
    while True:
        while pos<len(text) and text[pos] in ' \t\r\n,': pos+=1
        if text[pos]==']': break
        obj,end=decoder.raw_decode(text,pos)
        if obj.get('u') in by_url:
            row=by_url[obj['u']]; count+=1
            if obj.get('a')!='Sueño' or obj['en']['u']!=route(row['en_path']): raise ValueError('Wrong search mapping')
            obj['t']=row['title_es'];obj['d']=row['es'];obj['en']['d']=row['en']
            patches.append((pos,end,json.dumps(obj,ensure_ascii=False,indent=2).replace('\n','\n  ')))
        pos=end
    if count!=23: raise ValueError('Missing search records')
    return edits(text,patches)

def norm_title(s):
    s=html.unescape(re.sub(r'<[^>]+>',' ',s)).lower()
    s=''.join(c for c in s if c.isalnum() or c.isspace())
    return ' '.join(s.split())

def discover_sleep_routes(index_text, index_path):
    t=Tree(index_text); rows=[]
    for n in t.nodes:
        if n.tag!='a' or not has(n,'card') or n.attrs.get('data-area')!='Sueño': continue
        children=[c for c in t.nodes if c.parent==n]
        title=one((c for c in children if c.tag=='strong'),'sleep card title')
        url=urlsplit(urljoin('https://irisgreen.eu/'+index_path,n.attrs.get('href',''))).path
        rows.append((url,t.text(title)))
    if len(rows)!=23: raise ValueError(f'Expected 23 Sueño cards, got {len(rows)}')
    return rows

def import_once():
    if (ROOT/MANIFEST).exists():
        check(ROOT); return
    rows=load_source(); staged={}; preserved={}
    discovered=discover_sleep_routes((ROOT/INDEXES['es']).read_text(),INDEXES['es'])
    for row,(esroute,old_es_title) in zip(rows,discovered):
        ratio=SequenceMatcher(None,norm_title(old_es_title),norm_title(row['title_es'])).ratio()
        if ratio < .36: raise ValueError(f'Order/title mismatch for item {row["number"]}: {old_es_title!r} vs {row["title_es"]!r} ({ratio:.2f})')
        row['es_path']=esroute.lstrip('/')+'index.html'
        row['retained_title_es_before']=old_es_title
        es=(ROOT/row['es_path']).read_text();t,a,title,lead=page_nodes(es)
        chip=one((n for n in t.nodes if n.tag=='p' and has(n,'chips') and n.parent==a),'area')
        if t.text(chip)!='Sueño':raise ValueError('Not a Sueño entry')
        enlink=one((n for n in t.nodes if n.tag=='a' and n.attrs.get('lang')=='en' and has(n,'lang')), 'English counterpart')
        enroute=urlsplit(urljoin('https://irisgreen.eu/'+row['es_path'],enlink.attrs['href'])).path
        if not enroute.startswith('/en/situations/'):raise ValueError('Invalid English counterpart')
        row['en_path']=enroute.lstrip('/')+'index.html'
        en=(ROOT/row['en_path']).read_text();te,ae,et,el=page_nodes(en)
        eslink=one((n for n in te.nodes if n.tag=='a' and n.attrs.get('lang')=='es' and has(n,'lang')),'Spanish counterpart')
        if urlsplit(urljoin('https://irisgreen.eu/'+row['en_path'],eslink.attrs['href'])).path!=route(row['es_path']):raise ValueError('Counterparts do not match')
        row['retained_title_en']=te.text(et)
        for lang,text in [('es',es),('en',en)]:
            path=row[lang+'_path'];new=page_update(text,row,lang)
            def protected(s):
                tree,art,h,p=page_nodes(s)
                masked=edits(s,[inside(s,p,'APPROVED_DESCRIPTION'),inside(s,h,'APPROVED_TITLE')])
                return masked[masked.index('<body'):]
            if protected(text)!=protected(new):raise ValueError('Unapproved body change: '+path)
            if lang=='en' and page_nodes(new)[0].text(page_nodes(new)[2])!=row['retained_title_en']:raise ValueError('English heading altered')
            preserved[path]=sha(protected(text).encode());staged[path]=new
    for lang,path in INDEXES.items():staged[path]=index_update((ROOT/path).read_text(),path,rows,lang)
    staged['buscador.json']=search_update((ROOT/'buscador.json').read_text(),rows)
    m={'source':SOURCE,'source_sha256':SOURCE_SHA256,'scope':'23 Spanish titles and 46 submitted ES/EN descriptions only. English titles not supplied: retained. Other fields, sections, references, dates, controls, styles and URLs unchanged.','entries':[{k:v for k,v in r.items() if k not in ['es','en']} for r in rows],'unmodified_body_sha256':preserved}
    for path,new in staged.items(): (ROOT/path).write_text(new)
    (ROOT/MANIFEST).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
    check(ROOT)

def approved_rows():
    rows=load_source();m=json.loads((ROOT/MANIFEST).read_text())
    if m['source_sha256']!=SOURCE_SHA256 or len(m['entries'])!=23:raise ValueError('Invalid approval manifest')
    for row,entry in zip(rows,m['entries']):
        if entry['number']!=row['number'] or entry['title_es']!=row['title_es']:raise ValueError('Title or entry mapping mismatch')
        row.update(entry)
    if len({r['es_path'] for r in rows})!=23 or len({r['en_path'] for r in rows})!=23:raise ValueError('Duplicate mapping')
    return rows

def check(root):
    rows=approved_rows();catalog=json.loads((root/'buscador.json').read_text());index={x['u']:x for x in catalog}
    cards={lang:card_nodes((root/p).read_text(),p) for lang,p in INDEXES.items()}
    checked=[]
    for row in rows:
        for lang in ['es','en']:
            path=row[lang+'_path'];text=(root/path).read_text();t,a,title,lead=page_nodes(text)
            expected_title=row['title_es'] if lang=='es' else row['retained_title_en']
            if t.text(lead)!=row[lang] or t.text(title)!=expected_title:raise ValueError('Approved wording changed: '+path)
            metas=[n.attrs['content'] for n in t.nodes if n.tag=='meta' and (n.attrs.get('name')=='description' or n.attrs.get('property')=='og:description')]
            if metas!=[row[lang],row[lang]]:raise ValueError('Stale metadata: '+path)
            for n in t.nodes:
                if n.tag=='script' and n.attrs.get('type')=='application/ld+json':
                    stop=text.rfind('</script',n.start,n.end);obj=json.loads(text[n.opening_end:stop])
                    for item in obj.get('@graph',[]):
                        if item.get('@type')=='WebPage' and (item['description']!=row[lang] or item['name']!=expected_title):raise ValueError('Stale structured data: '+path)
            ct,cc=cards[lang];_,ch,cl=cc[route(path)]
            if ct.text(cl)!=row[lang] or ct.text(ch)!=expected_title:raise ValueError('Stale catalogue card: '+path)
            record=index[route(row['es_path'])]; record=record if lang=='es' else record['en']
            if record['d']!=row[lang] or record['t']!=expected_title:raise ValueError('Stale search entry: '+path)
            checked.append(path)
    return {'entries':23,'exact_descriptions':46,'spanish_titles':23,'english_titles':'preserved; absent from submitted source','checked_pages':checked,'catalogue_cards':46,'search_entries':23,'source_sha256':SOURCE_SHA256,'mode':'read-only verification; no automatic rewriting'}

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--apply',action='store_true');ap.add_argument('--root',type=Path,default=ROOT);args=ap.parse_args()
    if args.apply:import_once()
    print(json.dumps(check(args.root),ensure_ascii=False,indent=2))
