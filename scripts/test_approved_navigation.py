#!/usr/bin/env python3
"""Smoke/regression tests of the three approved pages; no clinical certification.
Requires Playwright. Run against a complete build, not the small text-only backup.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ENTRY='/es/situaciones/necesito-que-me-repitan-las-instrucciones/'
EN='/en/situations/i-need-instructions-repeated/'

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url')
    parser.add_argument('--out',default='/tmp/iris-navigation-tests')
    args=parser.parse_args()
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    report={'checks':[], 'page_errors':[], 'scope':'Homepage and instructions entry only; not an accessibility certification.'}
    server=None
    if args.base_url:
        base=args.base_url.rstrip('/')
    else:
        server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base='http://127.0.0.1:'+str(server.server_port)
    def passed(name):
        report['checks'].append(name)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            context=browser.new_context(viewport={'width':1280,'height':900},accept_downloads=True)
            page=context.new_page();page.set_default_timeout(15000)
            page.on('pageerror',lambda error:report['page_errors'].append(str(error)))
            requests=[]
            page.on('request',lambda r: requests.append((r.method,r.url,r.post_data)))
            page.goto(base+'/',wait_until='networkidle')
            assert page.locator('#home-view').is_visible()
            assert page.locator('#instruction-page').is_hidden()
            assert page.locator('[data-section]').count()==12
            assert page.locator('.brand img').evaluate('(e)=>e.complete&&e.naturalWidth>0')
            assert 'Prototipo' not in page.locator('body').inner_text()
            assert page.locator('meta[name=robots]').get_attribute('content')=='index,follow'
            assert page.locator('link[rel=canonical]').get_attribute('href')=='https://irisgreen.eu/'
            passed('Homepage renders original logo, 12 sections and production metadata')
            page.screenshot(path=str(out/'home-desktop.png'),full_page=True)
            page.locator('[data-example="2"]').click()
            result=page.locator('#result-list [data-route="ficha-instrucciones"]')
            result.wait_for()
            assert result.get_attribute('href')==ENTRY
            assert any(urlparse(x[1]).path=='/buscador.json' for x in requests)
            assert 'resultados' in page.url
            count=page.locator('#result-count').inner_text()
            result.click()
            assert page.url==base+ENTRY
            assert page.locator('#instruction-page').is_visible()
            assert page.locator('#home-view').is_hidden()
            assert page.locator('.option-list li').count()==2
            assert page.locator('link[rel=canonical]').get_attribute('href')=='https://irisgreen.eu'+ENTRY
            passed('Live common search index connects to the canonical article')
            page.screenshot(path=str(out/'instructions-desktop.png'),full_page=True)
            draft='Prueba de interfaz: necesito los pasos por escrito, gracias.'
            page.locator('#request-text').fill(draft)
            page.locator('[data-lang=en]').click()
            assert page.url==base+EN
            assert page.locator('html').get_attribute('lang')=='en'
            assert page.locator('#request-text').input_value()!=draft
            page.locator('[data-lang=es]').click()
            assert page.locator('#request-text').input_value()==draft
            passed('Language changes keep independent drafts and canonical URLs')
            page.locator('#show-request').click()
            assert page.locator('#large-message').inner_text()==draft
            page.keyboard.press('Escape')
            assert page.locator('#message-dialog').is_hidden()
            assert page.locator('#show-request').evaluate('(e)=>e===document.activeElement')
            passed('Large message, Escape and return focus')
            with page.expect_download() as dl:
                page.locator('#download-request').click()
            saved=Path(dl.value.path())
            assert saved.read_text()==draft+'\n'
            passed('Text download matches the edited message exactly')
            context.grant_permissions(['clipboard-read','clipboard-write'])
            page.locator('#copy-request').click()
            page.wait_for_function("document.getElementById('request-feedback').textContent.includes('copiado')")
            assert page.evaluate('navigator.clipboard.readText()')==draft
            passed('Copy matches the edited message exactly')
            # Back restores the same in-memory search and draft, including native history.
            page.go_back(wait_until='domcontentloaded')
            assert page.locator('#results').is_visible()
            assert page.locator('#q').input_value()=='se me olvidan las instrucciones'
            assert page.locator('#result-count').inner_text()==count
            page.locator('#result-list [data-route="ficha-instrucciones"]').click()
            assert page.locator('#request-text').input_value()==draft
            page.locator('.back-results').click()
            assert page.locator('#q').input_value()=='se me olvidan las instrucciones'
            passed('Browser Back and Back to results preserve search and draft')
            store=page.evaluate('Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))')
            assert all(draft not in v for v in store.values())
            assert all(draft not in (url+str(data)) and method=='GET' for method,url,data in requests)
            passed('No message in storage, URLs or request bodies; no POST from the editor')
            page.locator('#reading-open').click()
            page.locator('#compact-toggle').click()
            assert page.locator('[data-section]').count()==12
            assert all(page.locator('[data-section]').nth(i).is_visible() for i in range(12))
            page.locator('[data-size="1"]').click()
            page.locator('[data-pref=spacing]').click()
            page.locator('[data-pref=contrast]').click()
            page.locator('.ig-text-settings summary').click()
            page.locator('[data-ig-text-key=font]').select_option('wide')
            settings=page.evaluate('IGPreferences.get()')
            assert settings['scale']>1 and settings['spacing'] and settings['contrast']
            assert settings['text']['font']=='wide'
            page.locator('#reading-dialog [data-close]').last.click()
            passed('Shared reading module, font control and compact view keep every access')
            # Full page visit uses the very same ig-a11y preference store.
            page.on('dialog',lambda d:d.accept())
            page.goto(base+EN,wait_until='networkidle')
            assert page.locator('#instruction-page').is_visible()
            assert page.locator('html').get_attribute('lang')=='en'
            assert page.evaluate('IGPreferences.get().scale')==settings['scale']
            assert page.locator('#request-text').input_value()!=draft
            passed('Direct English entry has its content, shared preferences and fresh unsaved draft')
            page.locator('#reading-open').click();page.locator('#reset').click();page.locator('#reading-dialog [data-close]').last.click()
            # No autoplay; actual existing local player is used.
            audio_requests=[x for x in requests if '/audio/' in x[1]]
            assert not audio_requests
            page.locator('[data-ig-music]').first.click()
            assert page.locator('#ig-music-panel').is_visible()
            assert not any('/audio/' in x[1] for x in requests)
            page.locator('.ig-m-close').click()
            passed('Existing local music player opens without autoplay or an audio download')
            # Representative viewports and enlargement combinations, all links retained.
            for width in (320,360,390,768,1280,1440):
                page.set_viewport_size({'width':width,'height':900})
                for scale in (1,1.5):
                    page.evaluate('(scale)=>IGPreferences.update({scale,spacing:scale>1,controls:scale>1})',scale)
                    for route in ('inicio','ficha-instrucciones'):
                        if route=='inicio':
                            page.locator('.brand').click()
                        else:
                            if not page.locator('#result-list [data-route="ficha-instrucciones"]').count():
                                page.locator('[data-example="2"]').click()
                            else:
                                page.locator('[data-example="2"]').click()
                            page.locator('#result-list [data-route="ficha-instrucciones"]').click()
                        overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth+2')
                        assert not overflow,(width,scale,route,page.evaluate('document.documentElement.scrollWidth'))
            passed('320–1440 px layouts at 100% and 150% with wider text and larger controls')
            page.evaluate('IGPreferences.reset()')
            page.set_viewport_size({'width':390,'height':844})
            page.locator('[data-lang=es]').click()
            page.screenshot(path=str(out/'instructions-mobile.png'),full_page=True)
            page.locator('.brand').click();page.locator('#close-results').click()
            page.screenshot(path=str(out/'home-mobile.png'),full_page=True)
            # Empty, no-match and network-error states must remain distinguishable.
            page.locator('#q').fill('zzzzzzsincoincidencias999999')
            page.locator('#search-form button').click()
            page.wait_for_selector('#no-result',state='visible')
            assert 'muestra' not in page.locator('#no-result').inner_text()
            page.locator('#q').fill('');page.locator('#search-form button').click()
            assert page.locator('#search-message').is_visible()
            assert page.locator('#results').is_hidden()
            passed('Empty search and genuine no-match states are clear')
            failed=context.new_page()
            failed.route('**/buscador.json',lambda r:r.abort())
            failed.goto(base+'/',wait_until='networkidle')
            failed.locator('[data-example="2"]').click()
            failed.wait_for_function("document.getElementById('search-message').textContent.includes('could not load') || document.getElementById('search-message').textContent.includes('No se ha podido')")
            assert failed.locator('#results').is_hidden()
            failed.unroute('**/buscador.json')
            failed.locator('#search-form button').click()
            failed.locator('#result-list [data-route="ficha-instrucciones"]').wait_for()
            failed.close()
            passed('Failed index load reports an error and can be retried')
            # Server HTML carries real entry content without executing JavaScript.
            nojs=browser.new_context(java_script_enabled=False)
            for path in ('/',ENTRY,EN):
                static=nojs.new_page();static.goto(base+path,wait_until='domcontentloaded')
                assert static.locator('#home-view' if path=='/' else '#instruction-page').is_visible()
                if path!='/':
                    assert static.locator('.brief-box').inner_text()
                    assert static.locator('#request-text').input_value()
                    static.locator('#help-details summary').click()
                    assert static.locator('#help-details .detail-copy').is_visible()
                static.close()
            nojs.close()
            passed('Homepage links and both complete article pages exist without JavaScript')
            assert not report['page_errors'],report['page_errors']
            browser.close()
        report['passed']=True
    except Exception as error:
        report['passed']=False;report['failure']=repr(error)
        raise
    finally:
        (out/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        if server:server.shutdown()
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':main()
