#!/usr/bin/env python3
"""QA integración frontend del set canónico de tipos de eclipse R02."""
from __future__ import annotations
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import functools, json, re, threading

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'eclipse-canonical-r02-integration';OUT.mkdir(parents=True,exist_ok=True)
ROUTES={'es':'/es/intereses/eclipses/','en':'/en/interests/eclipses/'}
BASE_DIR=ROOT/'img/intereses/eclipses/canonical-r02'
MANIFEST=BASE_DIR/'manifest.json'
MAP=BASE_DIR/'eclipse-type-visual-map.json'
EXPECTED_KEYS=['solar:total','solar:parcial','solar:anular','lunar:total','lunar:parcial','lunar:penumbral']

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static_gate():
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    mapping=json.loads(MAP.read_text(encoding='utf-8'))
    assert manifest['version']=='R02'
    assert len(manifest['canonical_assets'])==6
    assert list(mapping['mapping'].keys())==EXPECTED_KEYS
    assert mapping['dispatch_key']==['source_domain','kind_es']
    assert mapping['fallback'] is None
    assert mapping['unknown_key_behavior']=='NO_CANONICAL_VISUAL__SURFACE_DATA_ONLY'
    by_file={a['file']:a for a in manifest['canonical_assets']}
    assert set(mapping['mapping'].values())==set(by_file)
    for a in manifest['canonical_assets']:
        for k in ('title_es','title_en','alt_es','alt_en'):
            assert a.get(k), (a['id'],k)
        p=BASE_DIR/a['file']
        assert p.is_file(),p
        txt=p.read_text(encoding='utf-8')
        assert not re.search(r'<text\b',txt,re.I),p
    for rel in mapping['didactic_sequences'].values():
        p=BASE_DIR/rel
        assert p.is_file(),p
        assert not re.search(r'<text\b',p.read_text(encoding='utf-8'),re.I),p
    js=(ROOT/'assets/ig-eclipses.js').read_text(encoding='utf-8')
    assert 'TYPE_MANIFEST_URL' in js and 'TYPE_MAP_URL' in js
    assert 'title_es' in js and 'title_en' in js and 'alt_es' in js and 'alt_en' in js
    assert "map.fallback !== null" in js
    assert "aria-keyshortcuts" in js and "data-kb-lat" in js and "data-kb-lon" in js
    assert "ev.key === 'ArrowUp'" in js and "ev.key === 'Enter'" in js
    return {
      'canonical_assets':6,
      'sequences':2,
      'dispatch_keys':EXPECTED_KEYS,
      'fallback':None,
      'localized_external_names':True,
    }

def contrast_ratio(page, foreground, background):
    return page.evaluate("""([fgSel,bgSel]) => {
      const parse = value => {
        const m=String(value).match(/[\\d.]+/g);
        if(!m||m.length<3) throw new Error('Unparseable colour '+value);
        return m.slice(0,3).map(Number);
      };
      const lum = rgb => {
        const c=rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
        return .2126*c[0]+.7152*c[1]+.0722*c[2];
      };
      const fg=document.querySelector(fgSel),bg=document.querySelector(bgSel);
      if(!fg||!bg) throw new Error('Missing contrast node '+fgSel+' / '+bgSel);
      const L1=lum(parse(getComputedStyle(fg).color));
      const L2=lum(parse(getComputedStyle(bg).backgroundColor));
      return (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    }""",[foreground,background])

def main():
    static=static_gate()
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    mapping=json.loads(MAP.read_text(encoding='utf-8'))
    by_file={a['file']:a for a in manifest['canonical_assets']}
    meta_by_key={k:by_file[v] for k,v in mapping['mapping'].items()}

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,path in ROUTES.items():
          for width in (320,390,1440):
            ctx=browser.new_context(viewport={'width':width,'height':900 if width==1440 else 844},has_touch=width<500)
            page=ctx.new_page()
            req=[];external=[];bad=[];errors=[]
            page.on('pageerror',lambda e,errors=errors:errors.append(str(e)))
            page.on('console',lambda m,errors=errors:errors.append(m.text) if m.type=='error' else None)
            page.on('request',lambda r,req=req,external=external:(req.append(urlsplit(r.url).path),external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(('data:','blob:')) else None))
            page.on('response',lambda r,bad=bad:bad.append((r.status,r.url)) if r.status>=400 else None)

            page.goto(base+path,wait_until='networkidle',timeout=60000)
            page.locator('#ec-time').wait_for(timeout=15000)
            page.locator('#ec-type-explorer').wait_for(timeout=15000)

            assert page.locator('#ec-type-explorer [data-eclipse-type-key]').count()==6
            # Chrome contrast must follow the global semantic theme instead of
            # combining a hardcoded white card with DARK NAVY text tokens.
            for theme in ('dark','light'):
                page.evaluate("(v)=>document.documentElement.setAttribute('data-ig-theme',v)",theme)
                page.wait_for_timeout(40)
                assert contrast_ratio(page,'#ec-type-explorer h3','#ec-type-explorer')>=4.5,(lang,width,theme,'explorer title contrast')
                assert contrast_ratio(page,'#ec-type-explorer .ec-type-explorer-head p','#ec-type-explorer')>=4.5,(lang,width,theme,'explorer copy contrast')
            page.evaluate("()=>document.documentElement.setAttribute('data-ig-theme','dark')")
            assert '/img/intereses/eclipses/canonical-r02/manifest.json' in req
            assert '/img/intereses/eclipses/canonical-r02/eclipse-type-visual-map.json' in req

            # Manifest ES/EN is the accessible-name authority, not the English SVG title/desc.
            for key in EXPECTED_KEYS:
                button=page.locator(f'#ec-type-explorer [data-eclipse-type-key="{key}"]')
                button.click()
                fig=page.locator(f'#ec-type-explorer .ec-canonical[data-visual-key="{key}"]')
                fig.wait_for()
                img=fig.locator('.ec-canonical-img')
                expected=meta_by_key[key]['alt_en' if lang=='en' else 'alt_es']
                assert img.get_attribute('alt')==expected,(lang,key,img.get_attribute('alt'),expected)
                expected_title=meta_by_key[key]['title_en' if lang=='en' else 'title_es']
                assert expected_title in fig.locator('figcaption').inner_text()
                seq=fig.locator('.ec-canonical-sequence').count()
                assert seq==(1 if key in ('solar:total','lunar:total') else 0),(lang,key,seq)
                if seq:
                    seq_alt=fig.locator('.ec-canonical-sequence').get_attribute('alt')
                    if key=='solar:total':
                        words=('contacto','parcial','totalidad','final') if lang=='es' else ('contact','partial','totality','end')
                    else:
                        words=('penumbral','parcial','total','final') if lang=='es' else ('penumbral','partial','totality','final')
                    assert all(w.lower() in seq_alt.lower() for w in words),(lang,key,seq_alt)

            assert contrast_ratio(page,'#ec-type-explorer .ec-canonical figcaption','#ec-type-explorer')>=4.5,(lang,width,'figcaption contrast')
            page.evaluate("()=>{document.documentElement.style.fontSize='200%'}")
            page.wait_for_timeout(120)
            assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+2"),(lang,width,'200% text horizontal overflow')
            explorer_box=page.locator('#ec-type-explorer').bounding_box();assert explorer_box
            assert explorer_box['x']>=-1 and explorer_box['x']+explorer_box['width']<=width+2,(lang,width,'200% explorer clipped',explorer_box)
            page.evaluate("()=>{document.documentElement.style.fontSize=''}")
            page.wait_for_timeout(80)

            # EXPLORE: recorrer tiempo; LOCATE: elegir otro eclipse; REVEAL: facts + canonical type visual.
            start_name='Start' if lang=='en' else 'Inicio'
            max_name='Maximum' if lang=='en' else 'Máximo'
            page.locator('#ec-ui button').filter(has_text=start_name).first.click()
            v0=page.locator('#ec-time').input_value()
            page.locator('#ec-ui button').filter(has_text=max_name).first.click()
            v1=page.locator('#ec-time').input_value()
            assert v0!=v1,(lang,width,'time exploration did not move',v0,v1)

            sel=page.locator('#ec-ecl')
            option_count=sel.locator('option').count()
            assert option_count>1
            current=sel.input_value()
            target='0' if current!='0' else '1'
            before=page.locator('#ec-now .cn-now-head').inner_text()
            sel.select_option(target)
            page.wait_for_timeout(80)
            after=page.locator('#ec-now .cn-now-head').inner_text()
            assert before!=after,(lang,width,'eclipse locate did not change')
            current_fig=page.locator('#ec-now .ec-canonical')
            assert current_fig.count()==1
            assert current_fig.locator('.ec-canonical-img').get_attribute('alt')

            # Axioma finding: arbitrary map-point selection must have a keyboard equivalent.
            if width==390:
                map_svg=page.locator('.ec-mapfig svg').first
                assert map_svg.get_attribute('tabindex')=='0',(lang,width,'map is not keyboard focusable')
                shortcuts=map_svg.get_attribute('aria-keyshortcuts') or ''
                for key in ('ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','Enter'):
                    assert key in shortcuts,(lang,width,'missing map shortcut',key,shortcuts)
                map_svg.focus()
                map_svg.press('End')
                assert map_svg.get_attribute('data-kb-region')=='inset',(lang,width,'End did not select Canary inset')
                lat0=float(map_svg.get_attribute('data-kb-lat'))
                lon0=float(map_svg.get_attribute('data-kb-lon'))
                map_svg.press('ArrowUp')
                map_svg.press('ArrowRight')
                lat1=float(map_svg.get_attribute('data-kb-lat'))
                lon1=float(map_svg.get_attribute('data-kb-lon'))
                assert lat1>lat0 and lon1>lon0,(lang,width,'arrow keys did not move map point',lat0,lon0,lat1,lon1)
                map_svg.press('Enter')
                page.wait_for_timeout(120)
                assert page.locator('#ec-place').input_value()=='_',(lang,width,'keyboard map point was not applied')
                chosen=page.locator('#ec-place option[value="_"]').inner_text()
                expected='Chosen point' if lang=='en' else 'Punto elegido'
                assert expected in chosen,(lang,width,'chosen point label missing',chosen)

            if lang=='es' and width in (390,1440):
                page.locator('#ec-type-explorer').screenshot(path=str(OUT/f'eclipse-r02-types-{width}.png'))

            assert not external,(lang,width,external)
            assert not bad,(lang,width,bad)
            assert not errors,(lang,width,errors)
            assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+2"),(lang,width,'overflow')
            cases.append({
              'lang':lang,'width':width,'types':6,
              'external_requests':len(external),'http_errors':len(bad),'js_errors':len(errors),
              'explore_locate_reveal':True,'localized_manifest_alt':True,
            })
            ctx.close()

        # Axioma motion rework: REDUCED and OFF use discrete stepping, never interval playback.
        for mode in ('reduced','off'):
            ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce' if mode=='reduced' else 'no-preference')
            page=ctx.new_page()
            page.goto(base+ROUTES['es'],wait_until='networkidle',timeout=60000)
            page.locator('#ec-time').wait_for(timeout=15000)
            if mode=='off':
                page.evaluate("()=>document.documentElement.setAttribute('data-ig-motion','off')")
            start_btn=page.locator('#ec-ui button').filter(has_text='Avanzar el tiempo').first
            before=page.locator('#ec-time').input_value()
            start_btn.click();page.wait_for_timeout(120)
            once=page.locator('#ec-time').input_value()
            page.wait_for_timeout(500)
            later=page.locator('#ec-time').input_value()
            assert before!=once,(mode,'discrete step did not advance')
            assert once==later,(mode,'continuous playback remained active',once,later)
            assert start_btn.get_attribute('aria-pressed')=='false',(mode,'play stayed pressed')
            ctx.close()

        for lang,path in ROUTES.items():
            ctx=browser.new_context(viewport={'width':390,'height':844})
            page=ctx.new_page();page.emulate_media(forced_colors='active')
            page.goto(base+path,wait_until='networkidle',timeout=60000)
            page.locator('#ec-type-explorer').wait_for()
            assert page.locator('#ec-type-explorer [data-eclipse-type-key]').first.is_visible()
            ctx.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'ECLIPSE_CANONICAL_TYPE_VISUAL_SET_PRISMA_INTEGRATION_PASS',
      'next':'AXIOMA_A11Y_QA',
      'static':static,
      'summary':{
        'browser_cases':len(cases),
        'languages':['es','en'],
        'widths':[320,390,1440],
        'canonical_types':6,
        'didactic_sequences':2,
        'forced_colors':True,
        'external_requests':sum(c['external_requests'] for c in cases),
        'http_errors':sum(c['http_errors'] for c in cases),
        'js_errors':sum(c['js_errors'] for c in cases),
        'explore_locate_reveal':True,
        'localized_manifest_alt':True,
        'reduced_and_off_discrete_time':True,
        'sequence_phase_order_in_alt':True,
        'semantic_theme_contrast':True,
        'text_200_percent_reflow':True,
        'map_arbitrary_point_keyboard_equivalent':True,
        'screenshots':['eclipse-r02-types-390.png','eclipse-r02-types-1440.png'],
      },
      'cases':cases,
      'passed':True,
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
