#!/usr/bin/env python3
"""Visual regressions: current shared headers, width, fonts and book pages."""
import functools,threading,json,hashlib,os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/iris-r09';OUT.mkdir(parents=True,exist_ok=True)


def check_inner_header(page,route,width):
 """The post-R09 desktop header intentionally has controls above navigation.

 Keep alignment checks on the first row and verify the separate navigation row
 is contained, non-overlapping, visible and reachable in DOM keyboard order.
 This checks the recorded layout; it does not imply Maria's visual acceptance.
 """
 header=page.locator('header.hd')
 if not header.count():return None
 geometry=header.evaluate('''(h)=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,center:r.y+r.height/2}};
  const visible=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)!==0&&r.width>0&&r.height>0};
  return {header:rect(h),top:[...h.children].filter(e=>e.matches('.brand,.tools,.langs')&&visible(e)).map(rect),nav:rect(h.querySelector('.nav')),links:[...h.querySelectorAll('.nav a')].map(e=>({href:e.getAttribute('href'),visible:visible(e),...rect(e)}))};
 }''')
 top=geometry['top'];nav=geometry['nav'];outer=geometry['header'];links=geometry['links']
 assert len(top)==3,(route,width,'missing top-row group',geometry)
 assert max(r['center'] for r in top)-min(r['center'] for r in top)<3,(route,width,'top-row alignment',geometry)
 assert nav['y']>=max(r['bottom'] for r in top)-1,(route,width,'navigation overlaps controls',geometry)
 assert nav['height']>0 and nav['width']>0,(route,width,'empty navigation')
 assert nav['x']>=outer['x']-1 and nav['right']<=outer['right']+1 and nav['bottom']<=outer['bottom']+1,(route,width,'navigation outside header',geometry)
 assert links,(route,width,'missing links')
 for link in links:
  assert link['visible'] and link['height']>=44,(route,width,'hidden or short navigation link',link)
  assert link['x']>=nav['x']-1 and link['right']<=nav['right']+1 and link['y']>=nav['y']-1 and link['bottom']<=nav['bottom']+1,(route,width,'clipped link',link)
 for index,a in enumerate(links):
  for b in links[index+1:]:
   assert not (min(a['right'],b['right'])-max(a['x'],b['x'])>1 and min(a['bottom'],b['bottom'])-max(a['y'],b['y'])>1),(route,width,'overlapping links',a,b)
 anchors=header.locator('.nav a');anchors.first.focus()
 for index in range(anchors.count()):
  assert anchors.nth(index).evaluate('(e)=>document.activeElement===e'),(route,width,'keyboard skipped link',index)
  if index+1<anchors.count():page.keyboard.press('Tab')
 geometry['keyboard_links_checked']=anchors.count()
 return geometry


class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def main():
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 rows=[];page=None;current={}
 try:
  with sync_playwright() as p:
   launch={}
   if os.environ.get('IRIS_AUDIT_BROWSER'):launch['executable_path']=os.environ['IRIS_AUDIT_BROWSER']
   browser=p.chromium.launch(**launch)
   for width in [1920,1440,320]:
    for route in ['/','/?lang=en','/es/recursos/','/en/resources/','/es/intereses/','/en/interests/','/es/taller/','/en/workshop/','/es/biblioteca/','/es/libros/']:
     current={'route':route,'width':width}
     ctx=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=ctx.new_page()
     try:
      page.goto(base+route,wait_until='networkidle');page.locator('main h1').first.wait_for();page.evaluate('document.fonts.ready')
      assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow')
      family=page.locator('main h1').first.evaluate('(e)=>getComputedStyle(e).fontFamily');assert 'Newsreader' in family,(route,family)
      if width>=1440:
       current['header']=check_inner_header(page,route,width)
       if route in ['/','/?lang=en']:
        home=page.locator('#home-view').bounding_box();assert home['width']>width*.95,(width,home)
      if width==1920 or width==320:page.screenshot(path=str(OUT/f'{len(rows):02d}-{width}.png'))
      rows.append({**current,'font':family,'passed':True})
      (OUT/'progress.json').write_text(json.dumps(rows,indent=2))
     except Exception:
      page.screenshot(path=str(OUT/'failure.png'),full_page=True)
      raise
     finally:ctx.close()
   ctx=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=ctx.new_page();page.goto(base+'/es/libros/',wait_until='networkidle')
   for book,count in [('luma',8),('autismo',7)]:
    current={'book':book}
    viewer=page.locator('#'+book+'-muestra');viewer.wait_for();viewer.locator('.ig-flip-page').wait_for();hashes=[]
    for i in range(count):
     viewer.locator('[data-ig-flip-next]').click();frame=viewer.locator('.ig-flip-sprite');frame.wait_for()
     frame.evaluate('(e)=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=getComputedStyle(e).backgroundImage.slice(5,-2)})')
     pos=frame.evaluate('(e)=>getComputedStyle(e).backgroundPositionY');assert pos==f'{i/(count-1)*100:g}%' or abs(float(pos[:-1])-i/(count-1)*100)<.01,pos
     shot=frame.screenshot();hashes.append(hashlib.sha256(shot).hexdigest())
     if i in [0,count-1]:(OUT/f'{book}-{i+2}.png').write_bytes(shot)
    assert len(set(hashes))==count,(book,'repeated page pixels',hashes)
    assert viewer.locator('[data-ig-flip-next]').is_disabled()
    viewer.locator('.ig-flip-stage').focus();page.keyboard.press('ArrowLeft');assert viewer.get_attribute('data-page')==str(count-1)
    rows.append({'book':book,'distinct_rendered_pages':count,'passed':True})
   browser.close()
 except Exception as error:
  (OUT/'failure.json').write_text(json.dumps({'case':current,'error':str(error),'completed':rows},indent=2))
  raise
 finally:server.shutdown();server.server_close()
 (OUT/'results.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows))

if __name__=='__main__':main()
