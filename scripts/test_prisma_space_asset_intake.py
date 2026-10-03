#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,json,threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'reports'/'prisma-space-asset-intake';OUT.mkdir(parents=True,exist_ok=True)
ROUTE='/tools/prisma/space-section-approved-fixture.html'
PROBE='/tools/prisma/fixtures/lazy-probe.svg'
FORBIDDEN=['/should-never-load-solar.png','/should-never-load-exo.png','/should-never-load-eclipse.png','/should-never-load-meteors.png']

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
    page=ctx.new_page();req=[];bad=[];errors=[]
    page.on('request',lambda r:req.append(urlsplit(r.url).path))
    page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.goto(base+ROUTE,wait_until='networkidle')
    root=page.locator('#space-section-shell[data-ready="true"]');root.wait_for()
    assert page.locator('.ig-space-card').count()==5
    assert page.locator('.ig-space-card[data-asset-status="approved"] img').count()==1
    assert page.locator('.ig-space-card[data-asset-status="pending"] img').count()==0
    approved=page.locator('.ig-space-card[data-asset-status="approved"] img')
    assert approved.get_attribute('loading')=='lazy'
    assert approved.get_attribute('decoding')=='async'
    assert approved.get_attribute('data-asset-approved')=='true'
    assert PROBE in req,(width,req)
    for p in FORBIDDEN: assert p not in req,(width,p,req)
    assert not bad,(width,bad);assert not errors,(width,errors)
    cases.append({'width':width,'approved_requests':req.count(PROBE),'pending_asset_requests':0})
    ctx.close()
   browser.close()
 finally: server.shutdown()
 report={'gate':'SPACE_SECTION_ASSET_INTAKE_PATH_PASS','cases':cases,'approved_only':True,'pending_zero_requests':True,'passed':True}
 (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
