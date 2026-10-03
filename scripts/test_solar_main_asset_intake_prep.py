#!/usr/bin/env python3
"""Prep gate · Solar System principal asset intake.

This does NOT approve or package visuals. It proves the existing product runtime
already satisfies EXPLORE -> LOCATE -> REVEAL and that the 10 approved masters
still have no invented web path/hash before Atlas packaging.
"""
from __future__ import annotations
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,json,threading

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
CONTRACT=ROOT/'assets/data/solar-main-asset-intake.json'
ROUTES={'es':'/es/intereses/sistema-solar/','en':'/en/interests/solar-system/'}
THREED='/assets/ig-sistema-solar-3d.js'
EXPECTED=['sol','mercurio','venus','tierra','marte','jupiter','saturno','urano','neptuno','pluton']

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static_gate():
    c=json.loads(CONTRACT.read_text(encoding='utf-8'))
    assert c['schema']=='iris-green/solar-main-asset-intake/v1'
    assert c['upstream_visual_gate']=='SOLAR_FOUNDATION_FINAL_10_MASTERS_PASS'
    assert c['packaging_status']=='PENDING_ATLAS_WEB_PACKAGE'
    assert c['interaction_contract']=='EXPLORE_LOCATE_REVEAL'
    assert [x['id'] for x in c['bodies']]==EXPECTED
    assert all(x['asset_status']=='pending_packaging' for x in c['bodies'])
    assert all(x['web_path'] is None and x['sha256'] is None for x in c['bodies'])
    shell=(ROOT/'assets/ig-sistema-solar.js').read_text(encoding='utf-8')
    engine=(ROOT/'assets/ig-sistema-solar-3d.js').read_text(encoding='utf-8')
    for token in ("VIEW.rotate(","VIEW.zoom(","VIEW.goTo(","PageDown","ArrowLeft","ss-now"):
        assert token in shell,token
    for token in ("rotate(S,P)","zoom(S)","goTo:_e","pointerdown","pointerup"):
        assert token in engine,token
    return {'bodies':10,'paths_assigned':0,'hashes_assigned':0,'direct_manipulation_contract':True}

def main():
    static=static_gate()
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch(args=['--use-gl=swiftshader'])
        for lang,path in ROUTES.items():
          for width in (390,1440):
            ctx=browser.new_context(viewport={'width':width,'height':900 if width==1440 else 844},has_touch=width<500)
            page=ctx.new_page();req=[];external=[];bad=[];errors=[]
            page.add_init_script("window.__IGSS_DEBUG=true")
            page.on('pageerror',lambda e,errors=errors:errors.append(str(e)))
            page.on('console',lambda m,errors=errors:errors.append(m.text) if m.type=='error' else None)
            page.on('request',lambda r,req=req,external=external:(req.append(urlsplit(r.url).path),external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(('data:','blob:')) else None))
            page.on('response',lambda r,bad=bad:bad.append((r.status,r.url)) if r.status>=400 else None)
            page.goto(base+path,wait_until='networkidle',timeout=60000)

            # 3D runtime remains lazy until a deliberate user action.
            assert THREED not in req,(lang,width,'3D eager')
            launch=page.locator('#ss-ui button').filter(has_text='Open interactive view' if lang=='en' else 'Abrir vista interactiva').first
            assert launch.is_visible()
            launch.click()
            page.locator('#ss-go').wait_for(timeout=15000)
            assert req.count(THREED)==1,(lang,width,req.count(THREED))
            assert page.locator('#ss-view canvas').count()==1
            assert page.locator('#ss-view').get_attribute('tabindex')=='0'

            # EXPLORE: rotate + zoom controls and keyboard equivalents.
            labels=('Turn left','Zoom in') if lang=='en' else ('Girar a la izquierda','Acercar')
            for lab in labels:
                b=page.locator(f'#ss-ui button[aria-label="{lab}"]')
                assert b.is_visible()
                box=b.bounding_box();assert box and box['width']>=44 and box['height']>=44,(lang,width,lab,box)
                b.click()
            view=page.locator('#ss-view');view.focus()
            page.keyboard.press('ArrowRight');page.keyboard.press('+')
            assert page.evaluate("()=>!!window.__IGSS_API")
            
            # LOCATE: native go-to select focuses a body.
            go=page.locator('#ss-go')
            go.select_option('venus')
            page.wait_for_timeout(120)
            assert page.evaluate("()=>window.__IGSS_API.focus()")=='venus'
            
            # REVEAL: same selection updates accessible visible facts.
            now=page.locator('#ss-now')
            txt=now.inner_text()
            assert ('Venus' in txt),(lang,width,txt[:160])
            assert now.locator('dl.cn-facts').count()==1
            assert view.get_attribute('aria-label') and 'Venus' in view.get_attribute('aria-label')

            assert not external,(lang,width,external)
            assert not bad,(lang,width,bad)
            assert not errors,(lang,width,errors)
            assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+2"),(lang,width,'overflow')
            cases.append({'lang':lang,'width':width,'3d_lazy':True,'explore':True,'locate':True,'reveal':True,'external':0,'http_errors':0,'js_errors':0})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'SOLAR_MAIN_RUNTIME_ASSET_INTAKE_READY',
      'blocked_by':'ATLAS_WEB_PACKAGING_FOR_SOLAR_FOUNDATION_FINAL_10',
      'next_on_package':'CONNECT_PATHS_HASHES -> QA -> CAPTURES -> AXIOMA',
      'static':static,
      'summary':{
        'browser_cases':len(cases),'languages':['es','en'],'widths':[390,1440],
        'explore_locate_reveal':True,'3d_lazy':True,
        'visual_paths_invented':0,'visual_assets_touched':0,
        'external_requests':0,'http_errors':0,'js_errors':0
      },
      'cases':cases,'passed':True
    }
    out=ROOT/'reports'/'solar-main-intake-prep';out.mkdir(parents=True,exist_ok=True)
    (out/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
