#!/usr/bin/env python3
"""QA del micro-bloque Cielo V2 · primer viewport."""
from __future__ import annotations
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,json,threading,re

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'cielo-v2-first-viewport';OUT.mkdir(parents=True,exist_ok=True)
ROUTES={'es':'/es/intereses/cielo/','en':'/en/interests/night-sky/'}
DEPTH='/es/intereses/cielo/cielo.json'
FIRST='/assets/data/cielo-v2-first-view.json'
ALLOWED_NEW={
 'assets/data/cielo-v2-first-view.json',
 'assets/ig-cielo-v2-first.js',
 'assets/ig-cielo-v2-first.css',
 'scripts/build_cielo_v2_first_view.py',
 'scripts/test_cielo_v2_first_viewport.py',
 '.github/workflows/cielo-v2-first-viewport.yml',
 'es/intereses/cielo/index.html',
 'en/interests/night-sky/index.html',
}

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static_gate():
    es=(ROOT/'es/intereses/cielo/index.html').read_text(encoding='utf-8')
    en=(ROOT/'en/interests/night-sky/index.html').read_text(encoding='utf-8')
    js=(ROOT/'assets/ig-cielo-v2-first.js').read_text(encoding='utf-8')
    data=json.loads((ROOT/'assets/data/cielo-v2-first-view.json').read_text(encoding='utf-8'))
    joined='\n'.join([es,en,js,json.dumps(data,ensure_ascii=False)])
    assert 'NASA' not in joined
    assert 'navigator.geolocation' not in joined
    assert 'http://' not in js and 'https://' not in js
    for html in (es,en):
        low=html.lower()
        assert '<table' not in low
        assert '88 constelaciones' not in low and '88 constellations' not in low
        assert '597' not in low and '8.920' not in low and '8,920' not in low
        assert 'mi cielo' not in low and 'my sky' not in low
        assert 'ig-cielo-vivo.js' not in low and 'ig-cielo.js' not in low
    assert data['target_count']>=12 and data['target_count']<=24
    assert data['max_constellation_labels']<=5
    assert len(data['stars'])==240 and 12<=len(data['constellations'])<=30
    assert data['sources']['HYG']['mode']=='SNAPSHOT_LOCAL'
    assert data['sources']['IAU']['mode']=='SNAPSHOT_LOCAL'
    assert data['sources']['JPL']['mode']=='LOCAL_FORMULA'
    assert data['depth_url']==DEPTH
    return {'stars_curated':len(data['stars']),'constellations_curated':len(data['constellations']),'target_count':data['target_count'],'label_limit':data['max_constellation_labels']}

def main():
    static=static_gate()
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[];failures=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,path in ROUTES.items():
          for width in [320,390,1440]:
            for motion in ['normal','reduced','none']:
              ctx=browser.new_context(viewport={'width':width,'height':900 if width==1440 else 844},has_touch=width<500,is_mobile=False)
              page=ctx.new_page()
              req=[];external=[];bad=[];errors=[]
              page.on('pageerror',lambda e, errors=errors: errors.append(str(e)))
              page.on('console',lambda m, errors=errors: errors.append(m.text) if m.type=='error' else None)
              page.on('request',lambda r,req=req,external=external: (req.append(urlsplit(r.url).path),external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(('data:','blob:')) else None))
              page.on('response',lambda r,bad=bad: bad.append((r.status,r.url)) if r.status>=400 else None)
              page.goto(base+path,wait_until='networkidle')
              page.locator('#cielo-v2[data-ready="true"]').wait_for(timeout=10000)
              page.evaluate("m=>window.__CIELO_V2_FIRST.setMotion(m)",motion)
              page.wait_for_timeout(230 if motion=='normal' else 50)

              stars=page.locator('.skyv2-star-target').count()
              labels=page.locator('.skyv2-const-label').count()
              assert 12<=stars<=24,(lang,width,motion,stars)
              assert labels<=5,(lang,width,motion,labels)
              assert page.locator('.skyv2-viewlist').is_visible()
              assert page.locator('.skyv2-star-target').first.is_visible()
              assert DEPTH not in req,(lang,width,motion,'depth eager')
              assert not external,(lang,width,motion,external)
              assert not bad,(lang,width,motion,bad)
              assert not errors,(lang,width,motion,errors)

              # LIGHT/NAVY chrome without changing the astronomy scene.
              page.locator('[data-theme="light"]').click()
              assert page.locator('#cielo-v2').get_attribute('data-theme')=='light'
              page.locator('[data-theme="navy"]').click()
              assert page.locator('#cielo-v2').get_attribute('data-theme')=='navy'

              # Keyboard look + reset.
              canvas=page.locator('.skyv2-canvas');canvas.focus()
              before=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.az")
              page.keyboard.press('ArrowRight');page.wait_for_timeout(240 if motion=='normal' else 40)
              after=page.evaluate("()=>window.__CIELO_V2_FIRST.camera.az")
              assert before!=after,(before,after)
              page.keyboard.press('Home');page.wait_for_timeout(240 if motion=='normal' else 40)

              # Touch/pointer selection: all targets are DOM controls.
              first=page.locator('.skyv2-star-target').first
              box=first.bounding_box();assert box
              if width<500:
                page.touchscreen.tap(box['x']+box['width']/2,box['y']+box['height']/2)
              else:
                first.click()
              page.wait_for_timeout(30)
              assert page.locator('.skyv2-info dl').count()==1

              # Depth loads only on explicit request (one representative case).
              depth_count=0
              if lang=='es' and width==390 and motion=='normal':
                page.locator('.skyv2-depth').click()
                page.locator('#cielo-v2[data-depth-loaded="true"]').wait_for(timeout=10000)
                depth_count=req.count(DEPTH)
                assert depth_count==1,req

              # 0 full-depth data other than the deliberate depth test.
              eager=[p for p in req if p==DEPTH]
              assert (len(eager)==depth_count),(lang,width,motion,eager)
              cases.append({'lang':lang,'width':width,'motion':motion,'stars':stars,'constellation_labels':labels,'external':len(external),'http_errors':len(bad),'js_errors':len(errors),'depth_requests':depth_count})
              ctx.close()

        # Forced colors must keep controls/list functional even with canvas simplified away.
        for lang,path in ROUTES.items():
          ctx=browser.new_context(viewport={'width':390,'height':844})
          page=ctx.new_page();page.emulate_media(forced_colors='active')
          page.goto(base+path,wait_until='networkidle');page.locator('#cielo-v2[data-ready="true"]').wait_for()
          assert page.locator('.skyv2-canvas').evaluate("e=>getComputedStyle(e).display")=='none'
          assert page.locator('.skyv2-viewlist').is_visible()
          assert page.locator('.skyv2-look button').first.is_visible()
          ctx.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'INTEREST_01_CIELO_V2_FIRST_VIEWPORT_PASS',
      'static':static,
      'cases':cases,
      'summary':{
        'browser_cases':len(cases),
        'languages':['es','en'],
        'widths':[320,390,1440],
        'motion':['normal','reduced','none'],
        'themes':['light','navy'],
        'forced_colors':True,
        'max_constellation_labels':max(c['constellation_labels'] for c in cases),
        'min_star_targets':min(c['stars'] for c in cases),
        'max_star_targets':max(c['stars'] for c in cases),
        'external_requests':sum(c['external'] for c in cases),
        'http_errors':sum(c['http_errors'] for c in cases),
        'js_errors':sum(c['js_errors'] for c in cases),
        'depth_eager_requests':0
      },
      'passed':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
