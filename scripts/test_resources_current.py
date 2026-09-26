#!/usr/bin/env python3
"""Current ES/EN resources: retirement, SEO, keyboard and printed materials."""
import argparse, functools, json, os, re, threading, xml.etree.ElementTree as ET
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

def open_printable(page):
    """Exercise the current anchor, not the retired game's .jg-card button."""
    links=page.locator('#im-app .im-card h3 a[data-open]')
    links.first.wait_for(state='visible')
    assert links.count()>0
    item_id=links.first.get_attribute('data-open')
    title=links.first.inner_text()
    links.first.focus();links.first.press('Enter')
    page.locator('#im-h1').wait_for(state='visible')
    assert page.evaluate('document.activeElement.id')=='im-h1'
    assert page.locator('#im-h1').inner_text()==title
    assert page.locator('#im-app .im-pages .im-sheet').count()>0
    return item_id,title

def return_printable(page,item_id):
    back=page.locator('#im-app [data-act="volver"]')
    back.focus();back.press('Enter')
    page.locator('#im-app .im-card').first.wait_for(state='visible')
    assert page.evaluate('document.activeElement.getAttribute("data-open")')==item_id

def browser_checks(root,out):
    from playwright.sync_api import sync_playwright
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
      with sync_playwright() as pw:
        launch={}
        if os.environ.get('IRIS_AUDIT_BROWSER'):launch['executable_path']=os.environ['IRIS_AUDIT_BROWSER']
        browser=pw.chromium.launch(**launch)
        for width in [1440,320]:
          for kind,pair in enumerate(PAIRS):
            for lang,path in zip(['es','en'],pair):
              row={'path':path,'width':width};ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce',accept_downloads=True)
              page=ctx.new_page();page.set_default_timeout(15000)
              errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
              try:
                # Observe print requests, then render the actual print stylesheet to PDF.
                page.add_init_script('window.__printCalls=0;window.print=()=>{window.__printCalls++};')
                page.goto(base+path,wait_until='networkidle');page.locator('main h1').first.wait_for()
                assert page.locator('html').get_attribute('lang')==lang
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),path
                page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')!='BODY'
                if kind==0:
                  # R42 life-stage orientation is now the canonical entry point.
                  # Exercise its explicit "view all" path before the unchanged game-card contract.
                  stage_all=page.locator('#jg-app [data-k="stage-all"]')
                  if stage_all.count():
                    stage_all.first.focus();stage_all.first.press('Enter')
                  # The play-first hub then asks what context to practise before listing games.
                  context_cards=page.locator('#jg-app .jg-context-card')
                  if context_cards.count():
                    context_cards.first.focus();context_cards.first.press('Enter')
                  cards=page.locator('main .jg-card');cards.first.wait_for(state='visible');assert cards.count()>0
                  cards.first.focus();cards.first.press('Enter')
                  page.locator('#jg-h2').wait_for()
                  assert page.evaluate('document.activeElement.id')=='jg-h2'
                elif kind==1:
                  # Printable routines use the same non-blocking stage orientation.
                  stage_all=page.locator('#im-app [data-act="stage:all"]')
                  if stage_all.count():
                    stage_all.first.focus();stage_all.first.press('Enter')
                  item_id,title=open_printable(page)
                  row['detail_keyboard']=True
                  button=page.locator('#im-app .im-side button[data-print]')
                  button.focus();button.press('Enter');page.wait_for_function('window.__printCalls>0')
                  assert page.evaluate('document.documentElement.classList.contains("im-printing")')
                  assert page.locator('#im-print .im-sheet').count()>0
                  assert page.locator('#im-print .sh-t').first.text_content()==title
                  row['printed_sheets']=page.locator('#im-print .im-sheet').count()
                  # The current printable UI offers print/save-PDF, not the retired PNG control.
                  assert page.locator('#im-app [data-k="png"]').count()==0
                  row['png']='not_applicable_no_png_control'
                elif kind==2:
                  page.locator('#rv-text-only').fill('Prueba' if lang=='es' else 'Example')
                  page.locator('#rv-add-text').focus();page.locator('#rv-add-text').press('Enter')
                  assert page.locator('#rv-builder-steps li').count()>0
                  row['builder_keyboard']=True
                  page.locator('#rv-ready-print').click();page.wait_for_function('window.__printCalls>0')
                  page.locator('#rv-ready-pdf').click();page.wait_for_function('window.__printCalls>1')
                if kind==0:
                  # R42 keeps secondary game actions in the explicit Options popover.
                  page.locator('.jg-actions-btn[popovertarget="jg-game-tools"]').click()
                  page.locator('[data-k="print"]').click();page.wait_for_function('window.__printCalls>0')
                pdf=page.pdf(print_background=True,prefer_css_page_size=True)
                (out/f'print-{kind}-{lang}-{width}.pdf').write_bytes(pdf);row['print_pdf_bytes']=len(pdf)
                assert len(pdf)>3000,(path,width,len(pdf))
                if kind==0:
                  row['png']='not_applicable_no_png_control'
                  page.locator('[data-k="otra"]').focus();page.locator('[data-k="otra"]').press('Enter')
                elif kind==1:
                  page.evaluate('window.dispatchEvent(new Event("afterprint"))')
                  assert not page.evaluate('document.documentElement.classList.contains("im-printing")')
                  return_printable(page,item_id);row['return_keyboard']=True
                assert not errors,(path,width,errors)
                # Canonical language navigation is observed, not replaced by a fixture.
                target_lang='en' if lang=='es' else 'es'
                button=page.locator('header [data-ig-lang="'+target_lang+'"]')
                button.click();page.wait_for_url('https://irisgreen.eu'+pair[1 if lang=='es' else 0]+'**',wait_until='commit')
                row['language_target']=page.url
                row['passed']=True;results.append(row)
                (out/'browser-progress.json').write_text(json.dumps(results,indent=2))
              except Exception as error:
                row.update(passed=False,error=str(error),page_errors=errors)
                results.append(row)
                (out/'browser-progress.json').write_text(json.dumps(results,indent=2))
                try:page.screenshot(path=str(out/f'failure-{kind}-{lang}-{width}.png'),full_page=True)
                except Exception:pass
                raise
              finally:ctx.close()
        browser.close()
    finally:server.shutdown();server.server_close()
    return results

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=ROOT/'dist');p.add_argument('--static-only',action='store_true');args,_=p.parse_known_args()
    out=ROOT/'reports/resources-current';out.mkdir(parents=True,exist_ok=True)
    result={'static':static(args.root)}
    if not args.static_only:result['browser']=browser_checks(args.root,out)
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':main()
