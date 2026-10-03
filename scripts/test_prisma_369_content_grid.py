#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-content-grid';OUT.mkdir(parents=True,exist_ok=True)

ROUTES=[
 ('conditions','es','/es/neurodiversidad/condiciones/autismo/'),
 ('conditions','en','/en/neurodiversity/conditions/autism/'),
 ('situations','es','/es/situaciones/cambiar-de-una-tarea-a-otra-me-bloquea/'),
 ('situations','en','/en/situations/switching-from-one-task-to-another-blocks-me/'),
 ('everyday','es','/es/biblioteca/dinero-contratos-formularios-y-tramites/'),
 ('everyday','en','/en/everyday-life/money-contracts-forms-and-paperwork/'),
]
VIEWPORTS=[(1440,1000),(820,1000),(390,844)]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def rect(loc):
    b=loc.bounding_box()
    assert b is not None
    return {k:round(float(b[k]),2) for k in ('x','y','width','height')}

def close(a,b,tol=3.0): return abs(a-b)<=tol

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for family,lang,route in ROUTES:
          for width,height in VIEWPORTS:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page(); errors=[]; bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(family,lang,width,'route',resp.status if resp else None)
            page.wait_for_selector('body[data-ig-r49="1"][data-ig-profile="content"]',timeout=10000)
            article=page.locator('main#main > article.ficha')
            card=page.locator('main#main > .iris-mini-card')
            assert article.count()==1,(family,lang,width,'article',article.count())
            assert card.count()==1,(family,lang,width,'card',card.count())
            m=rect(page.locator('main#main')); a=rect(article); k=rect(card)
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(family,lang,width,'overflow',overflow)
            if width==1440:
              assert a['width']>=800,(family,lang,width,'article too narrow',a)
              assert 280<=k['width']<=370,(family,lang,width,'card width',k)
              assert a['x']>=m['x']-3 and k['x']+k['width']<=m['x']+m['width']+3,(family,lang,width,m,a,k)
              assert a['x']+a['width']<k['x'],(family,lang,width,'columns overlap',a,k)
              assert (a['width']+k['width'])/m['width']>=0.88,(family,lang,width,'grid underuses main',m,a,k)
            else:
              assert close(a['x'],k['x']),(family,lang,width,'stack left mismatch',a,k)
              assert close(a['width'],k['width']),(family,lang,width,'stack width mismatch',a,k)
              assert k['y']>=a['y']+a['height']-2,(family,lang,width,'card not below article',a,k)
            if family=='conditions' and lang=='es':
              page.screenshot(path=str(OUT/f'conditions-{width}.png'),full_page=True)
            results.append({'family':family,'lang':lang,'width':width,'main':m,'article':a,'card':k,'overflow_px':overflow})
            assert not bad,(family,lang,width,'http',bad)
            assert not errors,(family,lang,width,'js',errors)
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    report={
      'gate':'ISSUE_369_P23_P25_P26_CONTENT_GRID_PASS',
      'routes':len(ROUTES),
      'cases':len(results),
      'desktop_body_min_width':800,
      'tablet_breakpoint':900,
      'passed':True,
      'results':results
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
