#!/usr/bin/env python3
"""QA · Cielo V2 · integración del paquete R03 de 88 constelaciones."""
from __future__ import annotations
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import functools, json, threading

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'cielo-constellations-r03';OUT.mkdir(parents=True,exist_ok=True)
ROUTES={'es':'/es/intereses/cielo/','en':'/en/interests/night-sky/'}
DEPTH='/es/intereses/cielo/cielo.json'
INDEX='/assets/data/cielo-constellations-r03-index.json'
ZIP_SHA='6606430fcc0cf732bb794d8d582bcb31b3e643ac76c96e241c74a8418264df47'
MANIFEST_SHA='b806c2f9135f03756a5695edc5e1d08dc3b21f4591e28944062292e0e205ef70'

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static_gate():
    idx=json.loads((ROOT/INDEX.lstrip('/')).read_text(encoding='utf-8'))
    full=json.loads((ROOT/'es/intereses/cielo/cielo.json').read_text(encoding='utf-8'))
    assert idx['schema']=='iris-green-night-sky-runtime-index-r03'
    assert idx['source_gate']=='NIGHT_SKY_CONSTELLATION_PIPELINE_R03_FINAL_PASS'
    assert idx['source_zip_sha256']==ZIP_SHA
    assert idx['master_manifest_sha256']==MANIFEST_SHA
    assert idx['constellations_total']==88
    assert len(idx['constellations'])==88
    assert len({x['abbr'] for x in idx['constellations']})==88
    assert len(full['constelaciones'])==88
    assert {x['abbr'] for x in idx['constellations']}=={x['abbr'] for x in full['constelaciones']}
    assert idx['runtime_policy']['geometry']=='PROCEDURAL_LOCAL_FROM_CIELO_JSON'
    assert idx['runtime_policy']['r03_visual_masters']=='QA_REFERENCE_NOT_CARD_GALLERY'
    assert idx['runtime_policy']['direct_manipulation']=='EXPLORE_LOCATE_REVEAL'
    js=(ROOT/'assets/ig-cielo-v2-first.js').read_text(encoding='utf-8')
    assert "R03_INDEX_URL" in js and "locateConstellation" in js and "constellationsR03='88'" in js
    return {
      'constellations':88,
      'zip_sha256':ZIP_SHA,
      'manifest_sha256':MANIFEST_SHA,
      'procedural_runtime':True,
      'review_assets_not_card_gallery':True,
    }

def main():
    static=static_gate()
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,path in ROUTES.items():
          for width in (390,1440):
            ctx=browser.new_context(viewport={'width':width,'height':900 if width==1440 else 844},has_touch=width<500)
            page=ctx.new_page()
            req=[];external=[];bad=[];errors=[]
            page.on('pageerror',lambda e,errors=errors:errors.append(str(e)))
            page.on('console',lambda m,errors=errors:errors.append(m.text) if m.type=='error' else None)
            page.on('request',lambda r,req=req,external=external:(req.append(urlsplit(r.url).path),external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(('data:','blob:')) else None))
            page.on('response',lambda r,bad=bad:bad.append((r.status,r.url)) if r.status>=400 else None)

            page.goto(base+path,wait_until='networkidle',timeout=60000)
            page.locator('#cielo-v2[data-ready="true"]').wait_for(timeout=10000)

            # Lazy package intake: 88 catalogue is not requested in first viewport.
            assert INDEX not in req,(lang,width,'R03 index eager')
            assert DEPTH not in req,(lang,width,'full sky eager')
            assert page.locator('.skyv2-star-target').count()==18

            page.locator('.skyv2-meta > summary').click()
            page.locator('.skyv2-depth').click()
            page.locator('#cielo-v2[data-constellations-r03="88"]').wait_for(timeout=15000)

            assert req.count(INDEX)==1,(lang,width,req.count(INDEX))
            assert req.count(DEPTH)==1,(lang,width,req.count(DEPTH))
            assert page.locator('.skyv2-constellation-select option').count()==88
            state=page.evaluate("""()=>{const r=window.__CIELO_V2_FIRST,b=r.scene.getBoundingClientRect(),c=r.current(b.width,b.height);return {
              fullSky:r.fullSky,cons:r.consBy.size,stars:r.starVec.length,visible:c.visible.length,targets:c.targets.length,labels:c.cons.length
            }}""")
            assert state['fullSky'] and state['cons']==88 and state['stars']==5070,state
            if width<500:
                assert 120<=state['visible']<=260,state
                assert 12<=state['targets']<=24,state
                assert state['labels']<=4,state
            else:
                assert 180<=state['visible']<=420,state
                assert 24<=state['targets']<=40,state
                assert state['labels']<=6,state

            # LOCATE + REVEAL on one approved R03 constellation.
            sel=page.locator('.skyv2-constellation-select')
            sel.select_option('Ori')
            page.locator('.skyv2-locate-constellation').click()
            page.wait_for_timeout(260)
            assert page.locator('.skyv2-info').get_attribute('data-active')=='true'
            title=page.locator('.skyv2-info h2').inner_text()
            assert ('Orión' in title if lang=='es' else 'Orion' in title),title
            info=page.locator('.skyv2-info').inner_text()
            assert ('Altitud' in info and 'Azimut' in info and 'Dirección' in info) if lang=='es' else ('Altitude' in info and 'Azimuth' in info and 'Direction' in info)
            meta=page.evaluate("()=>window.__CIELO_V2_FIRST.r03By.get('Ori')")
            assert meta and meta['abbr']=='Ori'
            assert meta['descriptor_es']=='cazador'

            # EXPLORE remains direct manipulation after loading all 88.
            page.locator('.skyv2-meta').evaluate("e=>e.open=false")
            fov0=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.fov")
            page.locator('[data-zoom="in"]').click();page.wait_for_timeout(220)
            fov1=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.fov")
            assert fov1<fov0,(lang,width,fov0,fov1)
            canvas=page.locator('.skyv2-canvas');canvas.focus()
            az0=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.az")
            page.keyboard.press('ArrowRight');page.wait_for_timeout(220)
            az1=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.az")
            assert az0!=az1,(lang,width,'orientation did not move')

            # R03 review masters are not transformed into cards or raster requests.
            forbidden=[p for p in req if 'TANDA_' in p or p.endswith('_review.png') or p.endswith('_master.svg')]
            assert not forbidden,(lang,width,forbidden)
            assert not external,(lang,width,external)
            assert not bad,(lang,width,bad)
            assert not errors,(lang,width,errors)
            assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+2"),(lang,width,'overflow')

            if lang=='es':
                page.screenshot(path=str(OUT/f'cielo-r03-88-{width}.png'),full_page=False)

            cases.append({'lang':lang,'width':width,**state,'external':0,'http_errors':0,'js_errors':0,'explore_locate_reveal':True})
            ctx.close()

        # Forced-colors still exposes the 88-item navigator after explicit load.
        ctx=browser.new_context(viewport={'width':390,'height':844})
        page=ctx.new_page();page.emulate_media(forced_colors='active')
        page.goto(base+ROUTES['es'],wait_until='networkidle')
        page.locator('#cielo-v2[data-ready="true"]').wait_for()
        page.locator('.skyv2-meta > summary').click();page.locator('.skyv2-depth').click()
        page.locator('#cielo-v2[data-constellations-r03="88"]').wait_for()
        assert page.locator('.skyv2-constellation-select').is_visible()
        assert page.locator('.skyv2-locate-constellation').is_visible()
        ctx.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'NIGHT_SKY_CONSTELLATIONS_88_RUNTIME_INTEGRATION_PASS',
      'next':'AXIOMA_A11Y_QA',
      'static':static,
      'summary':{
        'browser_cases':len(cases),
        'languages':['es','en'],
        'widths':[390,1440],
        'constellations':88,
        'full_stars_local':5070,
        'mobile_visible_range':[120,260],
        'desktop_visible_range':[180,420],
        'mobile_targets_range':[12,24],
        'desktop_targets_range':[24,40],
        'forced_colors':True,
        'external_requests':0,
        'http_errors':0,
        'js_errors':0,
        'depth_eager_requests':0,
        'explore_locate_reveal':True,
        'review_assets_not_cards':True,
        'screenshots':['cielo-r03-88-390.png','cielo-r03-88-1440.png'],
      },
      'cases':cases,
      'passed':True,
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
