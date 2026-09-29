#!/usr/bin/env python3
"""Visual regressions: current shared headers, width, fonts and book pages."""
import functools,threading,json,hashlib,os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/iris-r09';OUT.mkdir(parents=True,exist_ok=True)


def check_inner_header(page,route,width):
 """Verify the current R49 global header contract.

 The current header intentionally contains only brand + Accessibility + Music +
 language. The thematic navigation lives elsewhere and must not be required here.
 """
 header=page.locator('.ig-r49-global-header[data-ig-r49-upgraded="true"]')
 if not header.count():return None
 geometry=header.evaluate('''(h)=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,center:r.y+r.height/2}};
  const visible=e=>{if(!e)return false;const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)!==0&&r.width>0&&r.height>0};
  const inner=h.querySelector('.ig-r49-header-inner');
  const brand=h.querySelector('.ig-r49-brand');
  const settings=h.querySelector('[data-ig-r49-settings]');
  const music=h.querySelector('[data-ig-music]');
  const lang=h.querySelector('.ig-r49-lang');
  return {
    header:rect(h),inner:inner?rect(inner):null,
    brand:brand&&visible(brand)?rect(brand):null,
    settings:settings&&visible(settings)?rect(settings):null,
    music:music&&visible(music)?rect(music):null,
    lang:lang&&visible(lang)?rect(lang):null,
    permanentNav:[...h.querySelectorAll('.nav,.ig-r49-primary')].filter(visible).length
  };
 }''')
 outer=geometry['header'];inner=geometry['inner']
 assert inner,(route,width,'missing R49 header inner',geometry)
 assert inner['x']>=outer['x']-1 and inner['right']<=outer['right']+1,(route,width,'header inner outside shell',geometry)
 assert geometry['brand'],(route,width,'missing brand',geometry)
 for key in ('settings','music','lang'):
  item=geometry[key];assert item,(route,width,'missing header control',key,geometry)
  assert item['height']>=44,(route,width,'short header control',key,item)
  assert item['x']>=outer['x']-1 and item['right']<=outer['right']+1,(route,width,'header control clipped',key,item)
 assert geometry['permanentNav']==0,(route,width,'retired permanent thematic nav visible',geometry)
 controls=header.locator('.ig-r49-brand,[data-ig-r49-settings],[data-ig-music],.ig-r49-lang')
 assert controls.count()==4,(route,width,'unexpected header control count',controls.count())
 controls.first.focus()
 for index in range(controls.count()):
  assert controls.nth(index).evaluate('(e)=>document.activeElement===e'),(route,width,'keyboard skipped header control',index)
  if index+1<controls.count():page.keyboard.press('Tab')
 geometry['keyboard_controls_checked']=controls.count()
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
    for route in ['/','/en/','/es/recursos/','/en/resources/','/es/intereses/','/en/interests/','/es/taller/','/en/workshop/','/es/biblioteca/','/es/libros/']:
     current={'route':route,'width':width}
     ctx=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=ctx.new_page()
     try:
      page.goto(base+route,wait_until='networkidle');page.locator('main h1').first.wait_for();page.evaluate('document.fonts.ready')
      assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow')
      family=page.locator('main h1').first.evaluate('(e)=>getComputedStyle(e).fontFamily');assert 'Newsreader' in family,(route,family)
      if width>=1440:
       current['header']=check_inner_header(page,route,width)
       if route in ['/','/en/']:
        # Home v4 is the canonical donor-backed Home.
        assert page.locator('body[data-ig-home-version="v4"]').count()==1,(route,width,'missing Home v4 marker')
        home=page.locator('.ig-home-v4-wrap').bounding_box();assert home,(width,'missing Home v4 wrap')
        expected=1240
        assert abs(home['width']-expected)<4,(width,home,expected)
        sabik=page.locator('#sabik-web-master').bounding_box();assert sabik,(route,width,'missing Sabik master')
        assert sabik['width']<=151,(route,width,'Sabik exceeds approved donor size',sabik)
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
