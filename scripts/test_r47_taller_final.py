#!/usr/bin/env python3
import functools,json,threading,traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; OUT=ROOT/'reports/r47-taller-final.json'; OUT.parent.mkdir(parents=True,exist_ok=True)
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
srv=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Q,directory=str(DIST))); threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{srv.server_port}'; rows=[]
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch()
  for route in ['/es/taller/','/en/workshop/']:
   for width in [1440,390]:
    ctx=b.new_context(viewport={'width':width,'height':900},reduced_motion='reduce'); p=ctx.new_page(); errors=[]; p.on('pageerror',lambda e:errors.append(str(e)))
    p.goto(base+route,wait_until='networkidle')
    row={'route':route,'width':width,'headers':p.locator('header').count(),'topbars':p.locator('header.ig-r42-topbar').count(),'main_igk':p.locator('main.igk').count(),'pageerrors':errors,'r64_text':p.get_by_text('HUMAN QA',exact=True).count()+p.get_by_text('Arte R54 aprobado',exact=True).count(),'studio_links':p.locator('a.igk-tile[data-studio]').count(),'unique_studios':p.locator('a.igk-tile[data-studio]').evaluate_all('(els)=>new Set(els.map(e=>e.dataset.studio)).size'),'overflow':p.evaluate('document.documentElement.scrollWidth>innerWidth+1')}
    rows.append(row); OUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    assert row['main_igk']==1,row
    assert row['r64_text']==0,row
    assert row['unique_studios']==27,row
    assert not row['overflow'],row
    assert not errors,row
    ctx.close()
  for route in ['/es/taller/modelado-3d/','/en/workshop/3d-modelling/','/es/taller/videomapping/','/en/workshop/projection-mapping/']:
   ctx=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce'); p=ctx.new_page(); errors=[]; p.on('pageerror',lambda e:errors.append(str(e)))
   p.goto(base+route,wait_until='networkidle'); p.locator('#igt-app').wait_for()
   row={'route':route,'app':p.locator('#igt-app').count(),'nojs_visible':p.locator('.igt-nojs').is_visible() if p.locator('.igt-nojs').count() else None,'pageerrors':errors}
   rows.append(row); OUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
   assert row['app']==1,row
   assert not errors,row
   ctx.close()
  b.close()
finally: srv.shutdown()
print(json.dumps(rows,ensure_ascii=False))
