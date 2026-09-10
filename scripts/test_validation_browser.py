#!/usr/bin/env python3
from __future__ import annotations
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd(); WEB=ROOT/'dist'; OUT=ROOT/'reports/standards'; OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(WEB)))
threading.Thread(target=server.serve_forever,daemon=True).start(); BASE=f'http://127.0.0.1:{server.server_port}'
CASES=[
 ('/es/neurodiversidad/condiciones/autismo/','reviewed','A'),
 ('/en/neurodiversity/conditions/autism/','reviewed','A'),
 ('/es/neurodiversidad/condiciones/trastorno-del-desarrollo-del-lenguaje-tdl/','reviewed','B'),
 ('/en/neurodiversity/conditions/developmental-language-disorder-dld/','reviewed','B'),
 ('/es/neurodiversidad/condiciones/agorafobia/','pending',None),
 ('/en/neurodiversity/conditions/agoraphobia/','pending',None),
]
R={'cases':[],'failures':[]}
try:
  with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width in (320,1440):
      for route,status,grade in CASES:
        ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce');p=ctx.new_page();errors=[]
        p.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
        p.on('pageerror',lambda e:errors.append(str(e)))
        row={'route':route,'width':width,'expected_status':status}
        try:
          p.goto(BASE+route,wait_until='domcontentloaded');p.locator('main h1').first.wait_for()
          st=p.locator('.ig-review-status');assert st.count()==1;assert st.is_visible()
          assert st.get_attribute('data-documentary-status')==status
          if grade:
            assert st.get_attribute('data-editorial-classification')==grade
            assert st.get_attribute('data-review-date')=='2026-09-07'
          else:
            assert st.get_attribute('data-review-date') is None
          overflow=p.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');assert overflow<=2,overflow
          assert not errors,errors
          row.update({'passed':True,'overflow_px':overflow})
        except Exception as e:
          row.update({'passed':False,'error':str(e)});R['failures'].append(row.copy())
        R['cases'].append(row);ctx.close()
    # Methodology language switch and normative content.
    for width in (320,1440):
      ctx=browser.new_context(viewport={'width':width,'height':900});p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
      p.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
      row={'route':'/es/metodologia/','width':width}
      try:
        p.goto(BASE+'/es/metodologia/',wait_until='domcontentloaded');p.locator('#normas-y-estados').wait_for();assert 'ISO/IEC 40500:2025' in p.locator('#normas-y-estados').inner_text()
        en=p.locator('[data-method-lang="en"]');en.click();p.locator('#normas-y-estados').wait_for();assert 'Internal conformance assessment' in p.locator('#normas-y-estados').inner_text()
        overflow=p.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');assert overflow<=2;assert not errors
        row.update({'passed':True,'overflow_px':overflow})
      except Exception as e: row.update({'passed':False,'error':str(e)});R['failures'].append(row.copy())
      R['cases'].append(row);ctx.close()
    browser.close()
finally: server.shutdown()
R['passed']=not R['failures'];R['summary']={'total':len(R['cases']),'passed':sum(x['passed'] for x in R['cases'])}
(OUT/'browser-validation.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']: raise SystemExit(1)
