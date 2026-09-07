#!/usr/bin/env python3
"""Browser media emulation, not a physical-device, screen-reader or braille test.
Run from dist. --phase before records the unchanged version without requiring additions.
"""
import argparse,functools,json,os,re,threading,traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
P=argparse.ArgumentParser();P.add_argument('--phase',choices=['before','after'],default='after');args=P.parse_args()
ROOT=Path.cwd();OUT=ROOT/'reports/system-accessibility';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'phase':args.phase,'cases':[],'failures':[],'notes':['Browser media emulation, not a physical-device accessibility certification.','No image filters or fictional game state are introduced.','Targeted occlusion checks focus existing controls after placing them under the panel.','External resources are blocked; audio files must not be requested by these interactions.']}
PAGES=['/','/es/neurodiversidad/condiciones/','/es/situaciones/','/es/neurodiversidad/condiciones/autismo/','/es/recursos/juegos/el-detective-de-los-sentidos/','/es/intereses/','/es/sitio-tranquilo/','/en/neurodiversity/conditions/']
TRIGGER='#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible'
READING='#a11yBtn:visible,.ig-uh-reading:visible,[data-ig-reading-trigger]:visible'
FILTER=':is(.ig-filter-button,.secfind button[data-type],.secfind button[data-letter],.situation-filter,#temaFilters .filter,.catbuttons button,.vd-filters button)[aria-pressed="true"]'
def fail(row,e):row.update(passed=False,error=str(e),traceback=traceback.format_exc());REPORT['failures'].append(row.copy())
def new(browser,width,**opts):
 ctx=browser.new_context(viewport={'width':width,'height':900},**opts);page=ctx.new_page();page.set_default_timeout(8000);audio=[];errors=[]
 def route(r):
  if re.search(r'/audio/.*\.(mp3|m4a|wav)(\?|$)',r.request.url):audio.append(r.request.url)
  r.continue_() if r.request.url.startswith(BASE) else r.abort()
 page.route('**/*',route);page.on('pageerror',lambda e:errors.append(str(e)))
 return ctx,page,audio,errors

def load(page,path):
 page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(100)

def inspect_media(page):
 return page.evaluate('''()=>({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,forced:matchMedia('(forced-colors:active)').matches,system:IGPreferences.system?.()||null,rootMotion:document.documentElement.dataset.igMotion,animated:document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().duration>0).length})''')

try:
 with sync_playwright() as pw:
  opts={'executable_path':os.environ['IG_TEST_BROWSER']} if os.environ.get('IG_TEST_BROWSER') else {}
  browser=pw.chromium.launch(**opts);REPORT['browser']=browser.version
  for width in [1440,320]:
   for path in PAGES:
    row={'test':'system preferences and Reset','path':path,'width':width}
    ctx,page,audio,errors=new(browser,width,reduced_motion='reduce',forced_colors='active')
    try:
     load(page,path);row['initial_media']=inspect_media(page)
     page.locator(READING).first.click();panel=page.locator('[data-ig-reading-panel]:visible');panel.wait_for()
     buttons=panel.get_by_role('button');reset=buttons.filter(has_text=re.compile('^(Restablecer|Reset)$'));reset.click()
     row['after_reset']=inspect_media(page)
     assert row['initial_media']['animated']==0 and row['after_reset']['animated']==0
     if args.phase=='after':
      assert row['after_reset']['system']=={'reducedMotion':True,'forcedColors':True}
      assert row['after_reset']['rootMotion']=='off'
      assert re.search(r'(dispositivo|device)',panel.inner_text()),'System information absent from panel'
     stored=page.evaluate('localStorage.getItem("ig-a11y")')
     page.emulate_media(reduced_motion='no-preference',forced_colors='none');page.wait_for_timeout(100)
     assert page.evaluate('localStorage.getItem("ig-a11y")')==stored
     if args.phase=='after':assert inspect_media(page)['rootMotion']==''
     page.emulate_media(reduced_motion='reduce',forced_colors='active');page.wait_for_timeout(100)
     toggle=buttons.filter(has_text=re.compile('^(Letra más separada|More spacing|Más espacio|Espaciado|Spaced text|Spacing)$'))
     if not toggle.count():toggle=panel.locator('button[aria-pressed]').first
     toggle.click();assert toggle.get_attribute('aria-pressed')=='true'
     row['selected_style']=toggle.evaluate('(e)=>({decoration:getComputedStyle(e).textDecorationLine,border:getComputedStyle(e).borderColor,adjust:getComputedStyle(e).forcedColorAdjust})')
     if args.phase=='after':
      assert 'underline' in row['selected_style']['decoration'];assert row['selected_style']['adjust']=='auto'
     reset.click();page.keyboard.press('Escape');assert not panel.is_visible()
     row['overflow']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');assert row['overflow']<=2
     if path=='/es/sitio-tranquilo/':
      page.locator('#startBreath').click();page.wait_for_timeout(100)
      row['started_ring_animation']=page.locator('.ring').evaluate('(e)=>getComputedStyle(e).animationName');assert row['started_ring_animation']=='none'
      page.locator('#stopBreath').click()
     if args.phase=='after' and path in ['/es/neurodiversidad/condiciones/','/es/intereses/','/']:
      page.screenshot(path=str(OUT/f'forced-{path.strip("/").replace("/","-") or "home"}-{width}.png'))
     assert not audio,audio;assert not errors,errors;row.update(no_auto_audio=True,passed=True)
    except Exception as e:fail(row,e)
    REPORT['cases'].append(row);ctx.close()
  for path in ['/es/neurodiversidad/condiciones/','/es/situaciones/','/es/videos/','/es/tramites/directorio/','/es/taller/','/es/investigacion/','/es/intereses/','/es/biblioteca/']:
   row={'test':'selected state beyond colour','path':path};ctx,page,audio,errors=new(browser,320,forced_colors='active')
   try:
    load(page,path);items=page.locator(FILTER+':visible');items.first.wait_for()
    row['states']=items.evaluate_all('(els)=>els.map(e=>({text:e.textContent.trim(),decoration:getComputedStyle(e).textDecorationLine,adjust:getComputedStyle(e).forcedColorAdjust}))')
    assert row['states']
    if args.phase=='after':assert all('underline' in x['decoration'] and x['adjust']=='auto' for x in row['states'])
    row['passed']=True
   except Exception as e:fail(row,e)
   REPORT['cases'].append(row);ctx.close()
  for width in [1440,320]:
   for path in ['/','/es/neurodiversidad/condiciones/','/es/intereses/']:
    for typ in ['music','reading']:
     row={'test':'focused control not covered','path':path,'width':width,'panel':typ};ctx,page,audio,errors=new(browser,width)
     try:
      load(page,path);page.locator(TRIGGER if typ=='music' else READING).first.click()
      panel=page.locator('#ig-music-panel' if typ=='music' else '[data-ig-reading-panel]:visible');panel.wait_for(state='visible')
      candidates=page.locator('main :is(a[href],button,input):visible');panel_box=panel.bounding_box();target=None
      for obj in candidates.all():
       box=obj.bounding_box()
       if box and box['y']>1100 and box['width']>100 and box['x']<panel_box['x']+panel_box['width'] and box['x']+box['width']>panel_box['x']+4:
        target=obj;break
      assert target,'No existing target for the occlusion test'
      target.evaluate('(e,y)=>scrollBy(0,e.getBoundingClientRect().top-y)',780)
      box=target.bounding_box();pr=panel.bounding_box()
      row['before_overlap']=bool(box['x']<pr['x']+pr['width'] and box['x']+box['width']>pr['x'] and box['y']<pr['y']+pr['height'] and box['y']+box['height']>pr['y'])
      assert row['before_overlap'],'Scenario did not produce the intended real overlap'
      h=page.evaluate('document.documentElement.scrollHeight')
      target.evaluate('(e)=>e.focus({preventScroll:true})');page.wait_for_timeout(100)
      row['panel_collapsed']=not panel.is_visible();row['focus_kept']=target.evaluate('(e)=>document.activeElement===e')
      if args.phase=='after':assert row['panel_collapsed'] and row['focus_kept']
      assert h==page.evaluate('document.documentElement.scrollHeight');assert not audio;row['passed']=True
     except Exception as e:fail(row,e)
     REPORT['cases'].append(row);ctx.close()
  browser.close()
finally:
 server.shutdown();REPORT['passed']=not REPORT['failures'];REPORT['count']=len(REPORT['cases'])
 (OUT/(args.phase+'.json')).write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'phase':args.phase,'total':len(REPORT['cases']),'passed':sum(x.get('passed',False) for x in REPORT['cases']),'failures':[dict((k,v) for k,v in x.items() if k!='traceback') for x in REPORT['failures']]},ensure_ascii=False))
if args.phase=='after' and not REPORT['passed']:raise SystemExit(1)
