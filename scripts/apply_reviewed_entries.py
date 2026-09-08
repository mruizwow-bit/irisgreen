#!/usr/bin/env python3
"""Apply the two explicitly reviewed records, not a mass editorial rewrite.
The JSON contains the source-to-claim mapping. Unreviewed pages are untouched.
No external reference links, clinical badges, fabricated dates or robots changes.
"""
from __future__ import annotations
import argparse, hashlib, html, json, re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'editorial/reviews/2026-09-07-autismo-tdl.json'
REPORT=ROOT/'reports/study-20260907'

class Node:
    def __init__(self,tag,attrs,start,opening_end,parent):
        self.tag,self.attrs,self.start,self.opening_end,self.end,self.parent=tag,dict(attrs),start,opening_end,opening_end,parent

class Tree(HTMLParser):
    void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self,source):
        super().__init__(convert_charrefs=False);self.source=source;self.nodes=[];self.stack=[];self.offsets=[0]
        for line in source.splitlines(keepends=True):self.offsets.append(self.offsets[-1]+len(line))
        self.feed(source);self.close()
    def position(self):
        line,col=self.getpos();return self.offsets[line-1]+col
    def handle_starttag(self,tag,attrs):
        a=self.position();n=Node(tag,attrs,a,a+len(self.get_starttag_text()),self.stack[-1] if self.stack else None);self.nodes.append(n)
        if tag not in self.void:self.stack.append(n)
    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if tag not in self.void:self.stack.pop()
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i].tag==tag:
                end=self.source.index('>',self.position())+1
                for n in self.stack[i:]:n.end=end
                del self.stack[i:];break
    def text(self,n):return html.unescape(re.sub('<[^>]+>','',self.source[n.start:n.end])).strip()

def has(n,cls):return cls in n.attrs.get('class','').split()
def within(n,parent):return parent.start<n.start<n.end<=parent.end
def esc(s):return html.escape(s,quote=True)
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def edits(text,items):
    ordered=sorted(items)
    for x,y in zip(ordered,ordered[1:]):assert x[1]<=y[0],'Overlapping changes'
    for a,b,value in reversed(ordered):text=text[:a]+value+text[b:]
    return text

def render(entry,loc,lang):
    out=[]
    for section in loc['sections']:
        css='sec helps' if section['key']=='helps' else 'sec'
        out.append('<section class="'+css+'" data-reviewed-section="'+section['key']+'"><h2>'+esc(section['heading'])+'</h2>')
        for i,p in enumerate(section['paragraphs']):
            cls=' class="lede"' if section['key']=='description' and i==0 else ''
            out.append('<p'+cls+' data-claim-id="'+esc(p['id'])+'" data-source-ids="'+esc(' '.join(p['sources']))+'">'+esc(p['text'])+'</p>')
        out.append('</section>')
    out.append('<section class="sec" data-reviewed-section="sources"><h2>'+('Base documental' if lang=='es' else 'Sources')+'</h2>')
    for ref in entry['references']:out.append('<p data-source-id="'+esc(ref['source'])+'">'+esc(ref[lang])+'</p>')
    out.append('</section>')
    return '\n'.join(out)

def update_page(text,entry,loc,lang):
    tree=Tree(text);article=next(n for n in tree.nodes if n.tag=='article' and has(n,'ficha'))
    sections=[n for n in tree.nodes if n.tag=='section' and n.parent==article]
    assert sections and all(has(n,'sec') for n in sections),'Unknown entry template'
    legacy={'sections':[text[n.start:n.end] for n in sections if has(n,'consult')],'removed_badges':[],'removed_notices':[]}
    changes=[(sections[0].start,sections[-1].end,render(entry,loc,lang))]
    for n in tree.nodes:
        if n.tag=='p' and within(n,article) and has(n,'notice') and tree.text(n).startswith('Draft entry.'):
            legacy['removed_notices'].append(tree.text(n));changes.append((n.start,n.end,''))
        if n.tag=='span' and within(n,article) and n.parent and has(n.parent,'chips') and re.match(r'^(Grade\s|DRAFT$)',tree.text(n)):
            legacy['removed_badges'].append(tree.text(n));changes.append((n.start,n.end,''))
        if n.tag=='title':changes.append((n.start,n.end,'<title>'+esc(loc['title'])+' · Iris Green</title>'))
        if n.tag=='meta' and (n.attrs.get('name')=='description' or n.attrs.get('property')=='og:description'):
            tag=text[n.start:n.end];tag,c=re.subn(r'content=([\"\']).*?\1',lambda _: 'content="'+esc(loc['summary'])+'"',tag,count=1,flags=re.S);assert c==1;changes.append((n.start,n.end,tag))
        if n.tag=='script' and n.attrs.get('type')=='application/ld+json':
            raw=text[n.opening_end:text.rfind('</script',n.start,n.end)];obj=json.loads(raw)
            def sync(value):
                if isinstance(value,dict):
                    if value.get('@type') in ['WebPage','MedicalWebPage']:value['description']=loc['summary'];value['name']=loc['title']
                    for child in value.values():sync(child)
                elif isinstance(value,list):
                    for child in value:sync(child)
            sync(obj);script=text[n.start:n.opening_end]+json.dumps(obj,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+'</script>'
            changes.append((n.start,n.end,script))
    return edits(text,changes),legacy

def update_index(text,index_path,updates):
    tree=Tree(text);changes=[];matched=[]
    for n in tree.nodes:
        if n.tag!='a' or not has(n,'card'):continue
        url=urlsplit(urljoin('https://irisgreen.eu/'+index_path.removesuffix('index.html'),n.attrs.get('href',''))).path
        if url not in updates:continue
        children=[c for c in tree.nodes if c.parent==n]
        summaries=[c for c in children if c.tag=='span' and not has(c,'chiprow') and not has(c,'chip')]
        assert len(summaries)==1,('Unknown card layout',url)
        s=summaries[0];changes.append((s.start,s.end,text[s.start:s.opening_end]+esc(updates[url])+'</span>'));matched.append(url)
    assert set(matched)==set(updates),(index_path,matched,list(updates))
    return edits(text,changes)

def run(check=False):
    data=json.loads(DATA.read_text());sources=data['sources'];staged={};legacy={};expected_descriptions={};index_groups={};paths=[]
    for entry in data['entries']:
        claim_sets=[]
        for lang,loc in entry['locales'].items():
            assert lang in ['es','en']
            claims=[p for s in loc['sections'] for p in s['paragraphs']]
            assert all(p['sources'] and set(p['sources'])<=set(sources) for p in claims)
            assert len({p['id'] for p in claims})==len(claims)
            assert {r['source'] for r in entry['references']}=={src for p in claims for src in p['sources']}
            claim_sets.append([(p['id'],p['sources']) for p in claims])
            path=loc['path'];old=(ROOT/path).read_text();new,leg=update_page(old,entry,loc,lang)
            staged[path]=new;legacy[path]=leg;paths.append(path)
            if lang=='es':expected_descriptions['/'+path.removesuffix('index.html')]=loc['summary']
            index='es/neurodiversidad/condiciones/index.html' if lang=='es' else 'en/neurodiversity/conditions/index.html'
            index_groups.setdefault(index,{})['/'+path.removesuffix('index.html')]=loc['summary']
        assert claim_sets[0]==claim_sets[1],('Different claim coverage by language',entry['id'])
    for path,updates in index_groups.items():staged[path]=update_index((ROOT/path).read_text(),path,updates)
    raw=(ROOT/'buscador.json').read_text();catalog=json.loads(raw);before={r['u']:dict(r) for r in catalog};seen=[]
    for row in catalog:
        route=urlsplit(row['u']).path
        if route in expected_descriptions:row['d']=expected_descriptions[route];seen.append(route)
    assert set(seen)==set(expected_descriptions)
    assert len(catalog)==len(before)
    assert len(catalog)>=372
    for r in catalog:assert {k:v for k,v in r.items() if k!='d'}=={k:v for k,v in before[r['u']].items() if k!='d'}
    # Keep the established JSON format and avoid rewriting every line.
    if any(r!=before[r['u']] for r in catalog):
        for r in catalog:
            old=before[r['u']]['d']
            if old!=r['d']:
                encoded=json.dumps(old,ensure_ascii=False);replacement=json.dumps(r['d'],ensure_ascii=False)
                if encoded in raw:raw=raw.replace(encoded,replacement)
                else:raw=raw.replace(json.dumps(old),json.dumps(r['d']))
        assert json.loads(raw)==catalog
    staged['buscador.json']=raw
    videos_path=ROOT/'videoteca-listado.json';vraw=videos_path.read_text();videos=json.loads(vraw);vcount=len(videos['videos']);old_total=videos.get('total')
    if old_total!=vcount:
        vraw,n=re.subn(r'("total"\s*:\s*)\d+',lambda m:m[1]+str(vcount),vraw,count=1);assert n==1
        assert json.loads(vraw)['videos']==videos['videos'];staged['videoteca-listado.json']=vraw
    changed=[p for p,s in staged.items() if s!=(ROOT/p).read_text()]
    if check:
        assert not changed,('Review outputs stale',changed)
        print(json.dumps({'checked_pages':paths,'source_records':len(sources),'same_claim_ids_by_language':True,'search_records':len(catalog),'video_total':vcount,'idempotent':True},ensure_ascii=False));return
    REPORT.mkdir(parents=True,exist_ok=True)
    baseline=REPORT/'legacy-two-entries.json'
    if not baseline.exists():baseline.write_text(json.dumps(legacy,ensure_ascii=False,indent=2)+'\n')
    # Write only once all structure and integrity checks have passed.
    for path,s in staged.items():
        if path in changed:(ROOT/path).write_text(s)
    report={'changed_files':changed,'reviewed_entries':len(data['entries']),'languages':['es','en'],'claim_pairs':sum(len(s['paragraphs']) for e in data['entries'] for s in e['locales']['es']['sections']),'search_records':len(catalog),'video_total_before':old_total,'video_total_after':vcount,'robots_changes':False,'clinical_validation':False,'note':'Documentary comparison of named claims only; all other entries remain outside this review.'}
    (REPORT/'applied.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');run(ap.parse_args().check)
