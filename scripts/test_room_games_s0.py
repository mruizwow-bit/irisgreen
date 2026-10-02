#!/usr/bin/env python3
"""Runtime gate for #326 · Room games S0 split."""
from __future__ import annotations
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import functools, json, threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'room-games-s0'
OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
PACK='/assets/data/juegos/r40-casa-memoria.js'
MONOLITH='/assets/data/juegos-iris-data.js'
INDEX='/assets/data/juegos-iris-index.js'

def path_of(url:str)->str:
    return urlsplit(url).path

def measure(page,path:str,expected_lang:str,expected_title:str):
    requests=[]
    external=[]
    responses={}
    def on_request(req):
        requests.append(req.url)
        if not req.url.startswith(BASE) and not req.url.startswith(('data:','blob:')):
            external.append(req.url)
    def on_response(resp):
        if not resp.url.startswith(BASE): return
        try:
            n=int(resp.headers.get('content-length') or 0)
        except ValueError:
            n=0
        responses[resp.url]=max(responses.get(resp.url,0),n)
    page.on('request',on_request)
    page.on('response',on_response)
    page.goto(BASE+path,wait_until='networkidle')
    page.locator('#jg-h2').wait_for(timeout=8000)
    initial=list(requests)
    paths=[path_of(u) for u in initial if u.startswith(BASE)]
    assert MONOLITH not in paths,paths
    assert INDEX not in paths,paths
    assert paths.count(PACK)==1,paths.count(PACK)
    payloads=[p for p in paths if p.startswith('/assets/data/juegos/')]
    assert payloads==[PACK],payloads
    assert not external,external
    assert page.evaluate('document.documentElement.lang').startswith(expected_lang)
    assert page.locator('#jg-h2').inner_text()==expected_title
    assert page.evaluate('window.IG_JUEGOS_DATA.juegos.length')==1
    assert page.evaluate('window.IG_JUEGOS_DATA.juegos[0].s')=='r40-casa-memoria'
    assert page.evaluate('localStorage.length')==0
    assert page.evaluate('sessionStorage.length')==0
    # Engine interaction is alive; memory grid is rendered as buttons.
    assert page.locator('.jg-mem button').count()>=6
    initial_bytes=sum(responses.values())
    before_reload=len(requests)
    page.reload(wait_until='networkidle')
    page.locator('#jg-h2').wait_for(timeout=8000)
    reentry=[path_of(u) for u in requests[before_reload:] if u.startswith(BASE)]
    assert reentry.count(PACK)==1,reentry
    assert MONOLITH not in reentry and INDEX not in reentry,reentry
    assert page.locator('#jg-h2').inner_text()==expected_title
    assert page.evaluate('localStorage.length')==0
    assert page.evaluate('sessionStorage.length')==0
    return {
        'route':path,
        'lang':expected_lang,
        'initial_transfer_bytes':initial_bytes,
        'initial_requests':paths,
        'pack_requests':paths.count(PACK),
        'monolith_requests':paths.count(MONOLITH),
        'index_requests':paths.count(INDEX),
        'external_requests':external,
        'refresh_pack_requests':reentry.count(PACK),
        'storage':{'local':0,'session':0},
    }

def measure_catalogue(page):
    responses={}
    page.on('response',lambda resp: responses.__setitem__(resp.url,max(
        responses.get(resp.url,0),
        int(resp.headers.get('content-length') or 0) if resp.url.startswith(BASE) else 0
    )))
    page.goto(BASE+'/es/recursos/juegos/',wait_until='networkidle')
    page.locator('#jg-app').wait_for(timeout=8000)
    return sum(v for u,v in responses.items() if u.startswith(BASE))

try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        ctx=browser.new_context(viewport={'width':1440,'height':900})
        before_page=ctx.new_page()
        before=measure_catalogue(before_page)
        before_page.close()
        es_page=ctx.new_page()
        es=measure(es_page,'/es/recursos/juegos/sala/parejas/','es','Memoria de casa')
        es_page.close()
        en_page=ctx.new_page()
        en=measure(en_page,'/en/resources/games/room/pairs/','en','Home memory')
        en_page.close()
        browser.close()
finally:
    server.shutdown()

report={
    'gate':'ROOM_GAMES_S0_SPLIT_PASS',
    'before_catalogue_transfer_bytes':before,
    'after_room_es_transfer_bytes':es['initial_transfer_bytes'],
    'after_room_en_transfer_bytes':en['initial_transfer_bytes'],
    'saved_vs_catalogue_es_bytes':before-es['initial_transfer_bytes'],
    'es':es,
    'en':en,
    'assertions':{
        'monolith_requests':0,
        'global_index_requests':0,
        'selected_pack_requests':1,
        'external_requests':0,
        'refresh_reentry':True,
        'es_en':True,
        'storage':0,
    },
    'passed':True,
}
(OUT/'runtime-network.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
