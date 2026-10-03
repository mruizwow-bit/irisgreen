#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-common-grid-p46';OUT.mkdir(parents=True,exist_ok=True)

ROUTES=[
 ('home','/'),
 ('conditions','/es/neurodiversidad/condiciones/'),
 ('situations','/es/situaciones/'),
 ('everyday','/es/biblioteca/'),
 ('data','/es/datos/'),
 ('research','/es/investigacion/'),
 ('support','/es/tramites/directorio/'),
 ('living_abroad','/es/vivir-fuera/'),
 ('workshop','/es/taller/'),
 ('games','/es/recursos/juegos/'),
 ('pictograms_proxy','/es/recursos/'),
]
VIEWPORTS=[(1440,1000),(390,844)]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def box(page,selector):
    loc=page.locator(selector).first
    if loc.count()==0: return None
    b=loc.bounding_box()
    if not b: return None
    return {k:round(float(b[k]),2) for k in ('x','y','width','height')}

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width,height in VIEWPORTS:
          for name,route in ROUTES:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page(); bad=[]
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,width,resp.status if resp else None)
            page.wait_for_selector('body[data-ig-r49="1"]',timeout=10000)
            target='.ig-home-v4-wrap' if name=='home' else 'main'
            main_box=box(page,target)
            footer=box(page,'.ig-r49-global-footer .ig-r49-footer-inner')
            assert main_box is not None,(name,width,'main')
            profile=page.locator('body').get_attribute('data-ig-profile') or ''
            rows.append({
              'surface':name,'route':route,'width':width,'profile':profile,
              'main':main_box,'footer':footer,
              'main_left':main_box['x'],
              'main_right':round(main_box['x']+main_box['width'],2),
              'footer_left':footer['x'] if footer else None,
              'footer_right':round(footer['x']+footer['width'],2) if footer else None,
              'http_errors':bad
            })
            if width==1440 and name in ('home','research','workshop','games'):
              page.screenshot(path=str(OUT/f'{name}-1440.png'),full_page=False)
            ctx.close()
        browser.close()
    finally:
      server.shutdown()

    desktop=[r for r in rows if r['width']==1440]
    mobile=[r for r in rows if r['width']==390]
    def clusters(vals,tol=3):
      out=[]
      for v in vals:
        hit=None
        for c in out:
          if abs(c[0]-v)<=tol: hit=c; break
        if hit is None: out.append([v,1])
        else: hit[1]+=1
      return [{'value':round(v,2),'count':n} for v,n in out]
    report={
      'gate':'ISSUE_369_P46_COMMON_GRID_AUDIT',
      'surfaces':len(ROUTES),
      'cases':len(rows),
      'desktop_left_clusters':clusters([r['main_left'] for r in desktop]),
      'desktop_right_clusters':clusters([r['main_right'] for r in desktop]),
      'mobile_left_clusters':clusters([r['main_left'] for r in mobile]),
      'mobile_right_clusters':clusters([r['main_right'] for r in mobile]),
      'footer_desktop_left_clusters':clusters([r['footer_left'] for r in desktop if r['footer_left'] is not None]),
      'rows':rows,
      'diagnostic_complete':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
