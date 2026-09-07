#!/usr/bin/env python3
"""Tests of the scoped editorial implementation, not automated scientific validation.
Scientific source-to-claim decisions are recorded separately in the review JSON.
"""
from __future__ import annotations
import argparse, functools, hashlib, json, re, threading, traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/study-20260907'
BASELINE=Path('/tmp/ig-study-baseline.json')
DATA=json.loads((ROOT/'editorial/reviews/2026-09-07-autismo-tdl.json').read_text())
TARGETS={loc['path'] for e in DATA['entries'] for loc in e['locales'].values()}
INDEXES={'es/neurodiversidad/condiciones/index.html','en/neurodiversity/conditions/index.html'}

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def pages():
    return sorted([*ROOT.glob('es/neurodiversidad/condiciones/*/index.html'),*ROOT.glob('en/neurodiversity/conditions/*/index.html'),*ROOT.glob('es/situaciones/*/index.html'),*ROOT.glob('en/situations/*/index.html')])
def robots(p):
    soup=BeautifulSoup(p.read_text(),'html.parser');tag=soup.find('meta',attrs={'name':'robots'})
    return tag.get('content') if tag else None

def baseline():
    BASELINE.write_text(json.dumps({'hashes':{p.relative_to(ROOT).as_posix():sha(p) for p in pages()},'robots':{p:robots(ROOT/p) for p in TARGETS},'search':json.loads((ROOT/'buscador.json').read_text()),'videos':json.loads((ROOT/'videoteca-listado.json').read_text())['videos']},ensure_ascii=False))
    print('Se ha conservado la comparación de todas las fichas y los dos catálogos.')

def run():
    OUT.mkdir(parents=True,exist_ok=True);before=json.loads(BASELINE.read_text());dist=ROOT/'dist'
    result={'entry_checks':[],'browser':[],'failures':[],'notes':['Tests confirm implementation and synchronisation; they do not independently validate scientific claims.','External domains are blocked in browser tests. No production performance or specialist review is claimed.']}
    checked=0
    for rel,digest in before['hashes'].items():
        if rel not in TARGETS:assert sha(ROOT/rel)==digest,('Unreviewed entry changed',rel);checked+=1
    result['unreviewed_entries_unchanged']=checked
    search=json.loads((ROOT/'buscador.json').read_text());old_search={r['u']:r for r in before['search']}
    assert len(search)==len(old_search)==372
    reviewed_es={urlsplit('/'+e['locales']['es']['path'].removesuffix('index.html')).path for e in DATA['entries']}
    for row in search:
        old=old_search[row['u']]
        if urlsplit(row['u']).path not in reviewed_es:assert row==old,('Unreviewed index row changed',row['u'])
        else:assert {k:v for k,v in row.items() if k!='d'}=={k:v for k,v in old.items() if k!='d'}
    result['search_records']=len(search)
    video=json.loads((ROOT/'videoteca-listado.json').read_text());assert video['videos']==before['videos'];assert video['total']==len(video['videos'])
    result['video_total']=video['total'];result['video_selection_unchanged']=True
    assert not any((dist/p).exists() for p in ['editorial','reports','scripts','.github','pt-br'])
    for entry in DATA['entries']:
        for lang,loc in entry['locales'].items():
            rel=loc['path'];soup=BeautifulSoup((dist/rel).read_text(),'html.parser');article=soup.select_one('article.ficha');text=article.get_text(' ',strip=True)
            assert robots(ROOT/rel)==before['robots'][rel],('Indexing changed',rel)
            assert all(x not in text for x in ['⚠','Grade B','DRAFT','Habla menos y peor','add year'])
            assert not article.select('.notice,.consult')
            claims=[p for sec in loc['sections'] for p in sec['paragraphs']]
            assert len(article.select('[data-claim-id]'))==len(claims)
            for p in claims:
                node=article.select_one('[data-claim-id="'+p['id']+'"]');assert node and node.get_text()==p['text']
                assert node['data-source-ids'].split()==p['sources']
            refs=article.select_one('[data-reviewed-section="sources"]');assert refs and not refs.select('a')
            assert [n.get_text() for n in refs.select('p')]==[r[lang] for r in entry['references']]
            assert soup.select_one('meta[name="description"]')['content']==loc['summary']
            index='es/neurodiversidad/condiciones/index.html' if lang=='es' else 'en/neurodiversity/conditions/index.html'
            listing=BeautifulSoup((dist/index).read_text(),'html.parser')
            route='/'+rel.removesuffix('index.html')
            card=next(a for a in listing.select('a.card') if urlsplit(urljoin('https://irisgreen.eu/'+index.removesuffix('index.html'),a['href'])).path==route)
            assert loc['summary'] in card.get_text(' ',strip=True)
            result['entry_checks'].append({'path':rel,'language':lang,'claim_count':len(claims),'references':len(entry['references']),'summary_matches_index':True,'robots_unchanged':True,'passed':True})
    # Queue problems, do not silently count an inventory as a validation.
    inventory=[]
    for p in pages():
        soup=BeautifulSoup(p.read_text(),'html.parser');main=soup.find('main')
        if not main:continue
        refs=[sec for sec in main.select('section') if sec.find(['h2','h3']) and sec.find(['h2','h3']).get_text(strip=True) in ['Base documental','Sources']]
        for sec in refs:
            t=sec.get_text(' ',strip=True)
            if '⚠' in t or re.search(r'\b(?:add year|pendiente|comprobar)\b',t,re.I):inventory.append({'path':p.relative_to(ROOT).as_posix(),'reference_text':t,'status':'needs_documentary_review'})
    (OUT/'reference-followup.json').write_text(json.dumps({'reviewed_here':sorted(TARGETS),'remaining_placeholder_entries':inventory,'note':'Mechanical detection of incomplete references, not a scientific quality score.'},ensure_ascii=False,indent=2)+'\n')
    result['reference_placeholders_queued']=len(inventory)
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(dist)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch()
            for enabled in [False,True]:
                for width in [1440,320]:
                    for entry in DATA['entries']:
                        for lang,loc in entry['locales'].items():
                            row={'id':entry['id'],'language':lang,'width':width,'javascript':enabled};errors=[];bad=[]
                            context=browser.new_context(viewport={'width':width,'height':1000},java_script_enabled=enabled)
                            page=context.new_page();page.set_default_timeout(10000)
                            page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
                            page.on('pageerror',lambda e:errors.append(str(e)))
                            page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.url.startswith(base) and r.status>=400 else None)
                            try:
                                page.goto(base+'/'+loc['path'].removesuffix('index.html'),wait_until='load')
                                assert page.locator('main h1').inner_text()==loc['title']
                                assert page.locator('[data-claim-id]').count()==sum(len(s['paragraphs']) for s in loc['sections'])
                                # Browser evaluation is a test capability even with site JavaScript disabled.
                                row['overflow_px']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
                                assert row['overflow_px']<=2,'Text overflows viewport'
                                assert not errors,errors
                                assert not bad,bad
                                if enabled:
                                    y=page.locator('main').bounding_box()['y'];h=page.evaluate('document.documentElement.scrollHeight')
                                    page.locator('#plBtn').click();panel=page.locator('#ig-music-panel');panel.wait_for(state='visible')
                                    assert panel.evaluate('(e)=>getComputedStyle(e).position')=='fixed'
                                    assert abs(page.locator('main').bounding_box()['y']-y)<1
                                    assert page.evaluate('document.documentElement.scrollHeight')==h
                                    page.keyboard.press('Escape');assert not panel.is_visible();row['music_no_shift']=True
                                    if lang=='es':page.screenshot(path=str(OUT/f'{entry["id"]}-{width}.png'),full_page=True)
                                row['passed']=True
                            except Exception as e:row['passed']=False;row['error']=traceback.format_exc();result['failures'].append(row.copy())
                            result['browser'].append(row);context.close()
            browser.close()
    finally:server.shutdown()
    result['passed']=not result['failures'];result['browser_passed']=sum(r['passed'] for r in result['browser']);result['browser_tested']=len(result['browser'])
    (OUT/'tests.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False))
    if not result['passed']:raise SystemExit(1)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--baseline',action='store_true');args=ap.parse_args()
    baseline() if args.baseline else run()
