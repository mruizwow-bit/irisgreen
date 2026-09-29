#!/usr/bin/env python3
import functools, threading, json, traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
OUT=ROOT/'reports/r64-debug.json'; OUT.parent.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(DIST)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
expected={
 '/es/taller/':['Dibujo','Estructuras','Programación','Videojuegos','Mundos','Modelado 3D'],
 '/en/workshop/':['Drawing','Structures','Programming','Video games','Worlds','3D modelling'],
}
ages={
 '/es/taller/':['0–12 años','13–17 años','18 años o más','Todas las edades'],
 '/en/workshop/':['Ages 0–12','Ages 13–17','Ages 18+','All ages'],
}
rows=[]
def save(extra=None):
    payload={'cases':rows}
    if extra: payload.update(extra)
    OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2))
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch()
    for route in expected:
      for width in (1440,390):
        case={'route':route,'width':width,'checks':{}}
        rows.append(case); save()
        ctx=b.new_context(viewport={'width':width,'height':900},device_scale_factor=2 if width==390 else 1)
        page=ctx.new_page(); errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        try:
          page.goto(base+route,wait_until='networkidle')
          case['checks']['goto']=True; save()
          page.locator('.r64-main').wait_for(timeout=10000)
          case['checks']['r64_main']=True; save()
          names=page.locator('.r64-card h2').all_inner_texts(); case['names']=names
          case['checks']['names']=names==expected[route]; save()
          assert case['checks']['names'],(route,width,'names',names)
          labels=page.locator('.r64-age-buttons button').all_inner_texts(); case['ages']=labels
          case['checks']['ages']=labels==ages[route]; save()
          assert case['checks']['ages'],(route,width,'ages',labels)
          case['checks']['card_count']=page.locator('.r64-card').count()==6; save()
          assert case['checks']['card_count'],(route,width,'card count',page.locator('.r64-card').count())
          case['theme_initial']=page.locator('html').get_attribute('data-ig-theme')
          case['checks']['dark_initial']=case['theme_initial']=='dark'; save()
          assert case['checks']['dark_initial'],(route,width,'dark initial',case['theme_initial'])
          page.locator('[data-theme="light"]').click()
          case['theme_after']=page.locator('html').get_attribute('data-ig-theme')
          case['checks']['light_toggle']=case['theme_after']=='light'; save()
          assert case['checks']['light_toggle'],(route,width,'light toggle',case['theme_after'])
          sw=page.evaluate('document.documentElement.scrollWidth'); iw=page.evaluate('innerWidth')
          case['scrollWidth']=sw; case['innerWidth']=iw; case['checks']['overflow']=sw<=iw+1; save()
          assert case['checks']['overflow'],(route,width,'overflow',sw,iw)
          loaded=[]
          for i in range(6):
            ok=page.locator('.r64-card img').nth(i).evaluate('(e)=>e.complete&&e.naturalWidth>0')
            loaded.append(ok)
          case['images']=loaded; case['checks']['images']=all(loaded); case['pageerrors']=errors; save()
          assert case['checks']['images'],(route,width,'images',loaded)
          case['checks']['pageerrors']=not errors; save()
          assert not errors,(route,width,'pageerrors',errors)
          case['passed']=True; save()
        except Exception as e:
          case['passed']=False; case['error']=repr(e); case['pageerrors']=errors
          save({'error':repr(e),'traceback':traceback.format_exc()})
          raise
        finally:
          ctx.close()
    b.close()
finally:
  server.shutdown()
save({'passed':len(rows)==4 and all(x.get('passed') for x in rows)})
print(OUT.read_text())
