#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,json,threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-space-section-shell';OUT.mkdir(parents=True,exist_ok=True)
ROUTES={'es':'/es/intereses/','en':'/en/interests/'}

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass

def static_gate():
 for lang in ('es','en'):
  data=json.loads((ROOT/'assets/data'/f'space-section-shell.{lang}.json').read_text(encoding='utf-8'))
  assert data['schema']=='iris-green/space-section-shell/v1'
  assert len(data['entries'])==5
  assert [x['id'] for x in data['entries']]==['night-sky','solar-system','exoplanets','eclipses','meteors']
  assert all(x['assetStatus']=='pending' for x in data['entries'])
  assert all('src' not in x for x in data['entries'])
  assert all(x['routeStatus']=='active' for x in data['entries'][:4])
  assert data['entries'][4]['routeStatus']=='pending'
  assert 'href' not in data['entries'][4]
 return {'entries':5,'asset_status':'ALL_PENDING_ZERO_SRC','fifth':'METEORS_ROUTE_PENDING'}

def main():
 static=static_gate()
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 base=f'http://127.0.0.1:{server.server_port}';cases=[]
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch()
   for lang,path in ROUTES.items():
    for width,height in [(320,844),(390,844),(1440,900)]:
     ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=width<500)
     page=ctx.new_page();req=[];bad=[];errors=[];external=[]
     page.on('request',lambda r,req=req,external=external:(req.append(urlsplit(r.url).path),external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(('data:','blob:')) else None))
     page.on('response',lambda r,bad=bad:bad.append((r.status,r.url)) if r.status>=400 else None)
     page.on('pageerror',lambda e,errors=errors:errors.append(str(e)))
     page.on('console',lambda m,errors=errors:errors.append(m.text) if m.type=='error' else None)
     page.goto(base+path,wait_until='networkidle')
     root=page.locator('#space-section-shell[data-ready="true"]');root.wait_for(timeout=10000)
     cards=page.locator('.ig-space-card')
     assert cards.count()==5,(lang,width,cards.count())
     assert page.evaluate("()=>document.documentElement.scrollWidth<=window.innerWidth+1"),(lang,width,'horizontal overflow')
     assert page.locator('.ig-space-card img').count()==0,(lang,width,'pending visual leaked')
     assert page.locator('.ig-space-card[data-asset-status="pending"]').count()==5
     assert page.locator('.ig-space-card[data-route-status="active"] a[href]').count()==4
     # Global site link/button styles must not leak into the component surface.
     first_link=page.locator('.ig-space-card[data-route-status="active"] .ig-space-card-link').first
     visual_style=first_link.evaluate("e=>({bg:getComputedStyle(e).backgroundColor,td:getComputedStyle(e).textDecorationLine,title:getComputedStyle(e.querySelector('.ig-space-title')).textDecorationLine})")
     assert visual_style['bg'] in ('rgb(255, 255, 255)','rgba(255, 255, 255, 1)'),(lang,width,visual_style)
     assert visual_style['td']=='none' and visual_style['title']=='none',(lang,width,visual_style)
     fifth=page.locator('.ig-space-card[data-entry="meteors"]')
     assert fifth.get_attribute('data-route-status')=='pending'
     assert fifth.locator('a').count()==0
     assert fifth.locator('[aria-disabled="true"]').count()==1
     assert not any('/should-' in p for p in req)
     active=page.locator('.ig-space-card[data-route-status="active"] .ig-space-card-link')
     for i in range(active.count()):
      box=active.nth(i).bounding_box();assert box and box['height']>=44,(lang,width,i,box)
     page.locator('.ig-space-theme [data-theme="dark"]').click()
     assert root.get_attribute('data-theme')=='dark'
     page.locator('.ig-space-theme [data-theme="light"]').click()
     assert root.get_attribute('data-theme')=='light'
     if width in (320,390):
      assert page.locator('.ig-space-grid').evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').length")==1
     if lang=='es' and width==390:
      page.screenshot(path=str(OUT/'space-shell-390-light.png'),full_page=True)
     if lang=='es' and width==1440:
      page.locator('.ig-space-theme [data-theme="dark"]').click()
      page.screenshot(path=str(OUT/'space-shell-1440-dark.png'),full_page=True)
     assert not bad,(lang,width,bad);assert not errors,(lang,width,errors);assert not external,(lang,width,external)
     cases.append({'lang':lang,'width':width,'cards':5,'asset_requests':0,'routes_active':4,'route_pending':1,'themes':'PASS'})
     ctx.close()

   # Forced-colors: structure and navigation remain present.
   ctx=browser.new_context(viewport={'width':390,'height':844});page=ctx.new_page();page.emulate_media(forced_colors='active')
   page.goto(base+ROUTES['es'],wait_until='networkidle');page.locator('#space-section-shell[data-ready="true"]').wait_for()
   assert page.locator('.ig-space-card').count()==5
   assert page.locator('.ig-space-card[data-route-status="active"] a').first.is_visible()
   ctx.close();browser.close()
 finally: server.shutdown()
 report={'gate':'SPACE_SECTION_FRONTEND_SHELL_READY_FOR_ASSET_INTAKE','static':static,'cases':cases,'summary':{'widths':[320,390,1440],'languages':['es','en'],'light_dark':True,'forced_colors':True,'asset_requests_while_pending':0,'active_routes':4,'pending_routes':1},'passed':True}
 (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
