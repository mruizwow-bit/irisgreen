#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,json,threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'reports'/'prisma-interest-asset-cards';OUT.mkdir(parents=True,exist_ok=True)
ROUTE='/tools/prisma/interest-asset-cards-fixture.html'
PROBE='/tools/prisma/fixtures/lazy-probe.svg'
FORBIDDEN=['/should-never-load-sol.png','/should-never-load-venus.png','/should-never-load-earth.png']
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass

def main():
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 base=f'http://127.0.0.1:{server.server_port}';cases=[]
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch()
   for width,height in [(320,844),(390,844),(1440,900)]:
    ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=width<500)
    page=ctx.new_page();req=[];bad=[];errors=[];external=[]
    page.on('request',lambda r:req.append(urlsplit(r.url).path))
    page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.goto(base+ROUTE,wait_until='networkidle')
    root=page.locator('#cards[data-ready="true"]');root.wait_for()
    assert page.locator('.igac-card').count()==4
    assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+1"),width
    for p in FORBIDDEN: assert p not in req,(width,p,req)
    pending=page.locator('.igac-card[data-asset-status="pending"] img')
    assert pending.count()==0
    approved=page.locator('.igac-card[data-asset-status="approved"] img')
    assert approved.count()==1
    assert approved.get_attribute('loading')=='lazy'
    assert approved.get_attribute('data-asset-approved')=='true'
    assert PROBE in req,(width,req)
    for i in range(page.locator('.igac-card-action').count()):
     box=page.locator('.igac-card-action').nth(i).bounding_box();assert box and box['height']>=44
    page.locator('.igac-toolbar [data-theme="dark"]').click()
    assert root.get_attribute('data-theme')=='dark'
    page.locator('.igac-toolbar [data-theme="light"]').click()
    assert root.get_attribute('data-theme')=='light'
    page.locator('[data-activate="mercurio"]').click()
    assert page.evaluate("()=>window.__activated")=='mercurio'
    assert page.locator('.igac-card[data-item="mercurio"]').get_attribute('data-current')=='true'
    assert not bad,(width,bad);assert not errors,(width,errors);assert not external,(width,external)
    if width in (320,390):
     assert page.locator('.igac-grid').evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').length")==1
    if width in (390,1440): page.screenshot(path=str(OUT/f'cards-{width}.png'),full_page=True)
    cases.append({'width':width,'requests':len(req),'forbidden_asset_requests':0,'theme_toggle':True,'activation':True})
    ctx.close()
   browser.close()
 finally: server.shutdown()
 report={'gate':'PRISMA_INTEREST_ASSET_CARDS_FOUNDATION_R01_PASS','cases':cases,'asset_gate':'only assetStatus=approved receives an image src','passed':True}
 (OUT/'qa.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
 print(json.dumps(report,indent=2,ensure_ascii=False))
if __name__=='__main__':main()
