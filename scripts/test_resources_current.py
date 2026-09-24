#!/usr/bin/env python3
"""Current ES/EN resources: retirement, SEO, keyboard and exported materials."""
import argparse, functools, json, re, threading, xml.etree.ElementTree as ET
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT=Path(__file__).resolve().parents[1]
PAIRS=[('/es/recursos/juegos/','/en/resources/games/'),('/es/recursos/rutinas-imprimibles/','/en/resources/printable-routines/'),('/es/recursos/rutinas-visuales/','/en/resources/visual-routines/')]

def static(root):
    retired=json.loads((ROOT/'scripts/retired_game_routes.json').read_text())
    for slug in retired:assert not (root/'es/recursos/juegos'/slug).exists(),slug
    for name in ['assets/games','assets/iris-inventory.js','assets/taller.js','assets/cielo.js','assets/data/rutinas-92-427.json','assets/data/juegos-image-first-42.json','es/recursos/juegos/juegos-120.json']:
        assert not (root/name).exists(),name
    urls={e.text for e in ET.parse(root/'sitemap.xml').iter() if e.tag.endswith('}loc')}
    for es,en in PAIRS+[('/es/recursos/','/en/resources/')]:
        for path in [es,en]:
            assert 'https://irisgreen.eu'+path in urls,path
            text=(root/path.strip('/')/'index.html').read_text()
            for lang,target in [('es',es),('en',en)]:
                assert re.search(r'<link[^>]*hreflang=["\']'+lang+r'["\'][^>]*href=["\']https://irisgreen.eu'+re.escape(target)+r'["\']',text),path
    assert not any('/es/recursos/juegos/'+slug+'/' in u for slug in retired for u in urls)
    nav=(root/'assets/navigation-approved.js').read_text()
    assert '"url_en":"/en/resources/"' in nav
    return {'retired_directories':len(retired),'current_routes_in_sitemap':8,'reciprocal_hreflang':True}

def browser_checks(root,out):
    from playwright.sync_api import sync_playwright
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width in [1440,320]:
          for kind,pair in enumerate(PAIRS):
            for lang,path in zip(['es','en'],pair):
              row={'path':path,'width':width};ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce',accept_downloads=True)
              page=ctx.new_page();page.set_default_timeout(15000)
              # Observe print requests, then render the actual print stylesheet to PDF.
              page.add_init_script('window.__printCalls=0;window.print=()=>{window.__printCalls++};')
              page.goto(base+path,wait_until='networkidle');page.locator('main h1').first.wait_for()
              assert page.locator('html').get_attribute('lang')==lang
              assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),path
              page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')!='BODY'
              if kind in [0,1]:
                cards=page.locator('main .jg-card');assert cards.count()>0
                cards.first.focus();cards.first.press('Enter')
                page.locator('#jg-h2' if kind==0 else '#im-h1').wait_for()
                assert page.evaluate('document.activeElement.id') in ['jg-h2','im-h1']
              if kind==1:
                page.locator('[data-k="print"]').click();page.wait_for_function('window.__printCalls>0')
                with page.expect_download() as download:page.locator('[data-k="png"]').click()
                target=out/f'printable-{lang}-{width}.png';download.value.save_as(target)
                data=target.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n' and len(data)>1000
                row['png_bytes']=len(data)
              elif kind==2:
                page.locator('#rv-text-only').fill('Prueba' if lang=='es' else 'Example')
                page.locator('#rv-add-text').focus();page.locator('#rv-add-text').press('Enter')
                assert page.locator('#rv-builder-steps li').count()>0
                row['builder_keyboard']=True
                page.locator('#rv-ready-print').click();page.wait_for_function('window.__printCalls>0')
                page.locator('#rv-ready-pdf').click();page.wait_for_function('window.__printCalls>1')
              if kind==0:
                page.locator('[data-k="print"]').click();page.wait_for_function('window.__printCalls>0')
              if kind in [0,1,2]:
                pdf=page.pdf(print_background=True,prefer_css_page_size=True)
                (out/f'print-{kind}-{lang}-{width}.pdf').write_bytes(pdf);row['print_pdf_bytes']=len(pdf)
                assert len(pdf)>3000,(path,width,len(pdf))
              if kind==0:
                row['png']='not_applicable_no_png_control'
                page.locator('[data-k="otra"]').focus();page.locator('[data-k="otra"]').press('Enter')
              # Canonical language navigation is observed, not replaced by a fixture.
              target_lang='en' if lang=='es' else 'es'
              button=page.locator('header [data-ig-lang="'+target_lang+'"]')
              button.click();page.wait_for_url('https://irisgreen.eu'+pair[1 if lang=='es' else 0]+'**',wait_until='commit')
              row['language_target']=page.url
              row['passed']=True;results.append(row)
              (out/'browser-progress.json').write_text(json.dumps(results,indent=2))
              ctx.close()
        browser.close()
    finally:server.shutdown()
    return results

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=ROOT/'dist');p.add_argument('--static-only',action='store_true');args,_=p.parse_known_args()
    out=ROOT/'reports/resources-current';out.mkdir(parents=True,exist_ok=True)
    result={'static':static(args.root)}
    if not args.static_only:result['browser']=browser_checks(args.root,out)
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':main()
